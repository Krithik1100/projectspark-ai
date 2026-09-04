import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";

type RuntimeGlobals = typeof globalThis & {
  Deno?: { env?: { get?: (name: string) => string | undefined } };
  process?: { env?: Record<string, string | undefined> };
};

function runtimeEnv(name: string): string | undefined {
  const runtime = globalThis as RuntimeGlobals;
  return runtime.Deno?.env?.get?.(name) ?? runtime.process?.env?.[name];
}

export default defineTool({
  name: "recommend_project_titles",
  title: "Recommend project titles",
  description:
    "Generate candidate student software project titles with short implementation notes for a domain, team size, duration and preferred technology.",
  inputSchema: {
    domain: z.string().describe("Application domain, e.g. Healthcare, Education, E-Commerce."),
    teamSize: z.number().describe("Number of students on the team."),
    duration: z.number().describe("Available project duration in weeks."),
    technology: z.string().describe("Preferred technology stack."),
    count: z.number().optional().describe("How many ideas to return (5 by default, 10 maximum)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ domain, teamSize, duration, technology, count }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }

    const apiKey = runtimeEnv("LOVABLE_API_KEY");
    if (!apiKey) throw new ToolError("AI is not configured for this app.");

    const wanted = Math.max(1, Math.min(10, Math.round(count ?? 5)));

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are an SEPM project advisor. Return ONLY a JSON array of objects with keys title, description, complexity (Low|Medium|High). Keep descriptions to 2-3 sentences covering how to implement the project.",
          },
          {
            role: "user",
            content: `Suggest ${wanted} unique, feasible academic software project ideas. Domain: ${domain}. Team size: ${teamSize}. Duration: ${duration} weeks. Preferred technology: ${technology}.`,
          },
        ],
      }),
    });

    if (res.status === 429) throw new ToolError("AI rate limit reached, please retry shortly.");
    if (!res.ok) throw new ToolError(`AI request failed with status ${res.status}.`);

    const payload = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = payload.choices?.[0]?.message?.content ?? "";
    const json = raw.replace(/```json|```/g, "").trim();

    let ideas: Array<{ title: string; description: string; complexity?: string }> = [];
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) ideas = parsed;
    } catch {
      return { content: [{ type: "text", text: raw || "No ideas were generated." }] };
    }

    ideas = ideas.slice(0, wanted);

    const text = ideas
      .map(
        (idea, i) =>
          `${i + 1}. ${idea.title} [complexity: ${idea.complexity ?? "Medium"}]\n   ${idea.description}`,
      )
      .join("\n");

    return {
      content: [{ type: "text", text: text || "No ideas were generated." }],
      structuredContent: { domain, teamSize, duration, technology, ideas },
    };
  },
});
