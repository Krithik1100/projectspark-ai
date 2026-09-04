import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const HIGH_RISK_DOMAINS = ["Healthcare", "Finance", "IoT / Smart Home"];
const MEDIUM_RISK_DOMAINS = ["E-Commerce", "Gaming", "Transportation"];
const COMPLEX_TECH = ["Flutter + Firebase", "React Native", "Angular + .NET"];

export default defineTool({
  name: "assess_project_risk",
  title: "Assess project risk",
  description:
    "Rule-based SEPM assessment of a project idea: risk level (Low/Medium/High), estimated effort in weeks and a suggested SDLC model.",
  inputSchema: {
    title: z.string().describe("Project title being assessed."),
    domain: z.string().describe("Application domain, e.g. Healthcare, E-Commerce."),
    complexity: z.string().describe("Perceived complexity: Low, Medium or High."),
    teamSize: z.number().describe("Number of students on the team."),
    duration: z.number().describe("Available project duration in weeks."),
    technology: z.string().describe("Preferred technology stack."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ title, domain, complexity, teamSize, duration, technology }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }

    const normalizedComplexity =
      /high/i.test(complexity) ? "High" : /low/i.test(complexity) ? "Low" : "Medium";

    let score = normalizedComplexity === "High" ? 3 : normalizedComplexity === "Medium" ? 2 : 1;
    if (HIGH_RISK_DOMAINS.includes(domain)) score += 2;
    else if (MEDIUM_RISK_DOMAINS.includes(domain)) score += 1;

    const capacityRatio = (teamSize * duration) / 20;
    if (capacityRatio < 1) score += 2;
    else if (capacityRatio < 2) score += 1;
    if (COMPLEX_TECH.includes(technology)) score += 1;

    const risk: "Low" | "Medium" | "High" = score >= 6 ? "High" : score >= 4 ? "Medium" : "Low";

    let effort = 6;
    if (normalizedComplexity === "High") effort += 4;
    else if (normalizedComplexity === "Medium") effort += 2;
    effort = Math.ceil(effort * (1 - (Math.min(teamSize, 6) - 1) * 0.1));
    if (HIGH_RISK_DOMAINS.includes(domain)) effort += 2;
    effort = Math.min(effort, duration);

    const sdlc: "Agile" | "Waterfall" | "Iterative" =
      risk === "Low" && duration >= 8
        ? "Waterfall"
        : risk === "High" || duration <= 6
          ? "Agile"
          : "Iterative";

    const summary = `${title}\nRisk: ${risk} (score ${score})\nEstimated effort: ${effort} weeks of ${duration} available\nSuggested SDLC: ${sdlc}`;

    return {
      content: [{ type: "text", text: summary }],
      structuredContent: { title, risk, riskScore: score, effort, sdlc },
    };
  },
});
