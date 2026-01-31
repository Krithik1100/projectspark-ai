import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RiskInput {
  title: string;
  complexity: string;
  domain: string;
  teamSize: number;
  duration: number;
  technology: string;
}

function calculateRiskLevel(input: RiskInput): 'Low' | 'Medium' | 'High' {
  let riskScore = 0;

  // Complexity factor
  if (input.complexity === 'High') riskScore += 3;
  else if (input.complexity === 'Medium') riskScore += 2;
  else riskScore += 1;

  // Domain complexity
  const highRiskDomains = ['Healthcare', 'Finance', 'IoT / Smart Home'];
  const mediumRiskDomains = ['E-Commerce', 'Gaming', 'Transportation'];
  
  if (highRiskDomains.includes(input.domain)) riskScore += 2;
  else if (mediumRiskDomains.includes(input.domain)) riskScore += 1;

  // Team size vs duration
  const capacityRatio = (input.teamSize * input.duration) / 20;
  if (capacityRatio < 1) riskScore += 2;
  else if (capacityRatio < 2) riskScore += 1;

  // Technology familiarity (heuristic - newer/complex stacks are riskier)
  const complexTech = ['Flutter + Firebase', 'React Native', 'Angular + .NET'];
  if (complexTech.includes(input.technology)) riskScore += 1;

  // Map score to risk level
  if (riskScore >= 6) return 'High';
  if (riskScore >= 4) return 'Medium';
  return 'Low';
}

function estimateEffort(input: RiskInput): number {
  let baseEffort = 6; // Base weeks

  // Adjust for complexity
  if (input.complexity === 'High') baseEffort += 4;
  else if (input.complexity === 'Medium') baseEffort += 2;

  // Adjust for team size (more people can reduce time, but with diminishing returns)
  const teamFactor = 1 - (Math.min(input.teamSize, 6) - 1) * 0.1;
  baseEffort = Math.ceil(baseEffort * teamFactor);

  // Domain adjustments
  const complexDomains = ['Healthcare', 'Finance', 'IoT / Smart Home'];
  if (complexDomains.includes(input.domain)) baseEffort += 2;

  // Cap at available duration
  return Math.min(baseEffort, input.duration);
}

function suggestSDLC(risk: 'Low' | 'Medium' | 'High', duration: number): 'Agile' | 'Waterfall' | 'Iterative' {
  // Agile: Good for medium-high risk, changing requirements
  // Waterfall: Good for low risk, well-defined requirements
  // Iterative: Good for medium risk, moderate flexibility
  
  if (risk === 'Low' && duration >= 8) return 'Waterfall';
  if (risk === 'High') return 'Agile';
  if (duration <= 6) return 'Agile';
  return 'Iterative';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projects, domain, teamSize, duration, technology } = await req.json();

    const results = projects.map((project: { title: string; complexity: string }) => {
      const input: RiskInput = {
        title: project.title,
        complexity: project.complexity || 'Medium',
        domain,
        teamSize,
        duration,
        technology,
      };

      const risk = calculateRiskLevel(input);
      const effort = estimateEffort(input);
      const sdlc = suggestSDLC(risk, duration);

      return {
        title: project.title,
        risk,
        effort,
        sdlc,
      };
    });

    return new Response(
      JSON.stringify({ results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("calculate-risk error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
