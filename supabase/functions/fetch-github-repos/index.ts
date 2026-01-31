import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain, titles, githubToken } = await req.json();

    // Build search query
    const searchQuery = encodeURIComponent(`${domain} in:name,description,readme`);
    
    const headers: Record<string, string> = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Project-Recommender-App",
    };

    // Validate and use provided token (must be ASCII only for HTTP headers)
    // GitHub tokens are alphanumeric with underscores, typically starting with 'ghp_' or 'github_pat_'
    const isValidToken = githubToken && 
      typeof githubToken === 'string' && 
      /^[a-zA-Z0-9_]+$/.test(githubToken) &&
      githubToken.length > 10;

    if (isValidToken) {
      headers["Authorization"] = `token ${githubToken}`;
      console.log("Using provided GitHub token for authentication");
    } else if (githubToken) {
      console.log("Invalid GitHub token format, proceeding without authentication");
    }

    const response = await fetch(
      `https://api.github.com/search/repositories?q=${searchQuery}&sort=stars&per_page=30`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 403) {
        return new Response(
          JSON.stringify({ 
            error: "GitHub API rate limit exceeded. Add a GitHub token for more requests.",
            repos: [],
            isDemo: true
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    const repos = (data.items || []).map((repo: any) => ({
      name: repo.name,
      description: repo.description || "",
      topics: repo.topics || [],
      url: repo.html_url,
      stars: repo.stargazers_count,
    }));

    // Calculate uniqueness scores for each title
    const uniquenessScores: Record<string, { score: number; matches: string[] }> = {};
    
    for (const title of titles || []) {
      const titleWords = title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
      let bestMatchScore = 0;
      const matches: string[] = [];

      for (const repo of repos) {
        const repoText = `${repo.name} ${repo.description}`.toLowerCase();
        const repoWords = repoText.split(/\s+/);
        
        let matchCount = 0;
        for (const word of titleWords) {
          if (repoWords.some((rw: string) => rw.includes(word) || word.includes(rw))) {
            matchCount++;
          }
        }
        
        const similarity = titleWords.length > 0 ? (matchCount / titleWords.length) * 100 : 0;
        
        if (similarity > 30) {
          matches.push(repo.name);
        }
        
        if (similarity > bestMatchScore) {
          bestMatchScore = similarity;
        }
      }

      // Uniqueness is inverse of similarity
      const uniqueness = Math.max(0, Math.min(100, 100 - bestMatchScore * 0.8));
      uniquenessScores[title] = {
        score: Math.round(uniqueness + Math.random() * 15), // Add some variance
        matches: matches.slice(0, 3),
      };
    }

    return new Response(
      JSON.stringify({ repos, uniquenessScores }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("fetch-github-repos error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        repos: [],
        uniquenessScores: {}
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
