import { auth, defineMcp } from "@lovable.dev/mcp-js";
import recommendTitlesTool from "./tools/recommend-project-titles";
import checkUniquenessTool from "./tools/check-title-uniqueness";
import assessRiskTool from "./tools/assess-project-risk";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "projectspark-ai",
  title: "ProjectSpark AI",
  version: "0.1.0",
  instructions:
    "Tools for ProjectSpark AI, an SEPM project advisor. Use `recommend_project_titles` to generate candidate student software project ideas for a domain, team size, duration and tech stack; `check_title_uniqueness` to compare a title against public GitHub repositories and get a uniqueness percentage; and `assess_project_risk` to get a rule-based risk level, effort estimate in weeks and suggested SDLC model.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [recommendTitlesTool, checkUniquenessTool, assessRiskTool],
});
