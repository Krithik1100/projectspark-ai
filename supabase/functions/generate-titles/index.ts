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

    // Try Hugging Face first, fall back to Lovable AI
    const HF_TOKEN = Deno.env.get("Hugging_face_access_key");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!HF_TOKEN && !LOVABLE_API_KEY) {
      throw new Error("No AI API key configured");
    }
    
    const useHuggingFace = !!HF_TOKEN;

    const systemPrompt = `You are an expert software engineering project advisor specializing in academic software projects. Generate unique, feasible project ideas for students.

When generating project ideas, consider:
- Academic setting and learning objectives
- Team collaboration requirements
- Real-world applicability
- Technology stack compatibility
- Time constraints and complexity balance

Always provide practical, implementable projects with clear scope.`;

    const userPrompt = `Generate 5 unique software project title ideas for a team with these specifications:
- Domain: ${domain}
- Team Size: ${teamSize} members
- Duration: ${duration} weeks
- Technology Stack: ${technology}

For each project, provide:
1. A creative, descriptive title
2. A 2-3 sentence description of what the project does and its key features
3. Estimate implementation complexity (Low/Medium/High)

Format your response as a JSON array with objects containing: title, description, complexity.
Only return the JSON array, no other text.`;

    let response: Response;
    
    if (useHuggingFace) {
      // Use Hugging Face Inference API
      console.log("Using Hugging Face for title generation");
      response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `<s>[INST] ${systemPrompt}\n\n${userPrompt} [/INST]`,
          parameters: {
            max_new_tokens: 1500,
            temperature: 0.8,
            return_full_text: false,
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Hugging Face rate limit exceeded. Please try again later." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const errorText = await response.text();
        console.error("Hugging Face API error:", response.status, errorText);
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const hfData = await response.json();
      const content = hfData[0]?.generated_text || "";
      
      // Parse the JSON from the response
      let projects = [];
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          projects = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Failed to parse Hugging Face response:", parseError);
      }

      return new Response(
        JSON.stringify({ projects, provider: "huggingface" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Use Lovable AI Gateway
      console.log("Using Lovable AI for title generation");
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "API credits exhausted. Please add credits." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        throw new Error(`AI gateway error: ${response.status}`);
      }
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse the JSON from the response
    let projects = [];
    try {
      // Extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        projects = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Return empty array on parse failure
    }

    return new Response(
      JSON.stringify({ projects, provider: "lovable" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-titles error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
