import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

const STOP = new Set(["the", "and", "for", "with", "using", "based", "system", "app", "web"]);

function overlap(a: string[], b: string[]): number {
  const setA = new Set(a.filter((w) => !STOP.has(w)));
  const setB = new Set(b.filter((w) => !STOP.has(w)));
  if (setA.size === 0 || setB.size === 0) return 0;
  let hits = 0;
  for (const w of setA) if (setB.has(w)) hits++;
  return (hits / setA.size) * 100;
}

export default defineTool({
  name: "check_title_uniqueness",
  title: "Check title uniqueness",
  description:
    "Compare a project title against public GitHub repositories and return a uniqueness percentage plus the closest matching repositories.",
  inputSchema: {
    title: z.string().describe("Project title to check."),
    domain: z.string().optional().describe("Optional domain keyword to focus the GitHub search."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ title, domain }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }

    const query = [domain, ...words(title).slice(0, 4)].filter(Boolean).join(" ");
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      query,
    )}&sort=stars&order=desc&per_page=30`;

    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "projectspark-ai-mcp" },
    });

    if (!res.ok) {
      return {
        content: [
          {
            type: "text",
            text: `GitHub search failed (${res.status}). The public API may be rate limited; try again shortly.`,
          },
        ],
        isError: true,
      };
    }

    const data = (await res.json()) as {
      items?: Array<{ name: string; full_name: string; description: string | null; html_url: string; stargazers_count: number }>;
    };
    const repos = data.items ?? [];
    const titleWords = words(title);

    const scored = repos
      .map((r) => ({
        name: r.full_name,
        url: r.html_url,
        stars: r.stargazers_count,
        similarity: Math.round(overlap(titleWords, words(`${r.name} ${r.description ?? ""}`))),
      }))
      .sort((a, b) => b.similarity - a.similarity);

    const topSimilarity = scored[0]?.similarity ?? 0;
    const uniqueness = Math.max(5, Math.min(99, Math.round(100 - topSimilarity * 0.8)));
    const matches = scored.filter((r) => r.similarity > 30).slice(0, 5);

    const text = [
      `Title: ${title}`,
      `Uniqueness: ${uniqueness}% (searched ${repos.length} public repos for "${query}")`,
      matches.length
        ? `Closest matches:\n${matches.map((m) => `- ${m.name} (${m.similarity}% overlap, ${m.stars}★) ${m.url}`).join("\n")}`
        : "No closely matching public repositories found.",
    ].join("\n");

    return {
      content: [{ type: "text", text }],
      structuredContent: { title, uniqueness, reposSearched: repos.length, matches },
    };
  },
});
