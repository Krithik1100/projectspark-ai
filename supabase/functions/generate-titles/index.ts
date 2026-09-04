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
    const { domain, teamSize, duration, technology } = await req.json();

    const rawKey = Deno.env.get("GEMINI_API_KEY");
    if (!rawKey) {
      throw new Error("GEMINI_API_KEY is not configured in Supabase Secrets. Please add it under Edge Functions > Secrets.");
    }
    const GEMINI_API_KEY = rawKey.trim();

    const systemInstruction = `You are a premier Software Engineering and Project Management (SEPM) academic advisor.
Your mission is to generate innovative, academic-grade capstone/course project ideas for engineering students.
Every project MUST explicitly solve a clear real-world problem and possess a distinct uniqueness factor compared to standard generic GitHub repositories.`;

    const userPrompt = `Generate 5 innovative, realistic software engineering project title recommendations with these criteria:
- Target Domain: ${domain}
- Team Size: ${teamSize} students
- Project Timeline: ${duration} weeks
- Technology Stack: ${technology}

For each of the 5 projects, return a JSON object with:
1. "title": A professional, concise, academic-grade project title.
2. "description": 2-3 sentences explaining what the system does and its key functional modules.
3. "problemSolved": Exactly what specific real-world gap, user pain point, or operational inefficiency this project solves.
4. "uniquenessFactor": What makes this project distinct, novel, or superior compared to existing standard open-source boilerplate projects.
5. "complexity": "Low", "Medium", or "High".

Return ONLY a valid JSON array of objects with keys: ["title", "description", "problemSolved", "uniquenessFactor", "complexity"].`;

    // Try primary model, with fallback models if 404
    const modelsToTry = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-2.0-flash",
      "gemini-1.5-pro"
    ];

    let lastError = "";
    let candidateText = "";

    for (const model of modelsToTry) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            responseMimeType: "application/json",
          },
        }),
      });

      if (response.ok) {
        const geminiData = await response.json();
        candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) break;
      } else {
        const errorText = await response.text();
        lastError = `Model ${model} returned ${response.status}: ${errorText}`;
        console.warn(lastError);
      }
    }

    if (!candidateText) {
      throw new Error(`Failed to generate content with Gemini. ${lastError}`);
    }

    let projects = [];
    try {
      projects = JSON.parse(candidateText.trim());
    } catch {
      const cleanJson = candidateText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      projects = JSON.parse(cleanJson);
    }

    return new Response(
      JSON.stringify({ projects }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-titles error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error generating titles" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
