import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "and", "for", "with", "using", "based", "system", "app", "web", "application",
    "platform", "management", "tool", "smart", "intelligent", "online", "portal"
  ]);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain, titles, githubToken } = await req.json();

    const headers: Record<string, string> = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "ProjectSpark-AI-Analyzer",
    };

    const envToken = Deno.env.get("GITHUB_TOKEN");
    const activeToken = githubToken || envToken;

    if (activeToken && typeof activeToken === "string" && activeToken.length > 10) {
      headers["Authorization"] = `token ${activeToken}`;
    }

    // Query GitHub API for domain and relevant repos
    const domainQuery = encodeURIComponent(`${domain || ""} in:name,description`);
    const searchUrl = `https://api.github.com/search/repositories?q=${domainQuery}&sort=stars&order=desc&per_page=40`;

    const response = await fetch(searchUrl, { headers });

    let repos: Array<{
      name: string;
      fullName: string;
      description: string;
      url: string;
      stars: number;
      topics: string[];
    }> = [];

    if (response.ok) {
      const data = await response.json();
      repos = (data.items || []).map((repo: any) => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || "",
        url: repo.html_url,
        stars: repo.stargazers_count || 0,
        topics: repo.topics || [],
      }));
    } else {
      console.warn(`GitHub API search returned ${response.status}. Proceeding with heuristic scoring.`);
    }

    // Calculate uniqueness scores and find closest matching repos
    const uniquenessScores: Record<
      string,
      {
        score: number;
        matches: string[];
        detailedMatches: Array<{
          name: string;
          fullName: string;
          url: string;
          stars: number;
          description: string;
          similarity: number;
        }>;
      }
    > = {};

    for (const title of titles || []) {
      const titleWords = extractKeywords(title);

      const scoredRepos = repos.map((repo) => {
        const repoText = `${repo.name} ${repo.description} ${(repo.topics || []).join(" ")}`.toLowerCase();
        let matchedWords = 0;

        for (const word of titleWords) {
          if (repoText.includes(word)) {
            matchedWords++;
          }
        }

        const similarity = titleWords.length > 0 ? (matchedWords / titleWords.length) * 100 : 0;
        return {
          ...repo,
          similarity: Math.round(similarity),
        };
      });

      scoredRepos.sort((a, b) => b.similarity - a.similarity);

      const topSimilarity = scoredRepos[0]?.similarity || 0;
      // High similarity reduces uniqueness
      const calculatedUniqueness = Math.max(15, Math.min(98, Math.round(100 - topSimilarity * 0.75)));

      const closeMatches = scoredRepos.filter((r) => r.similarity > 20).slice(0, 4);

      uniquenessScores[title] = {
        score: calculatedUniqueness,
        matches: closeMatches.map((m) => m.name),
        detailedMatches: closeMatches.map((m) => ({
          name: m.name,
          fullName: m.fullName,
          url: m.url,
          stars: m.stars,
          description: m.description,
          similarity: m.similarity,
        })),
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
        error: error instanceof Error ? error.message : "GitHub fetch error",
        repos: [],
        uniquenessScores: {},
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
