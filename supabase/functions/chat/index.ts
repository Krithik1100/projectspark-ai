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
    const { messages, projectContext } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in Supabase Secrets");
    }

    const systemPrompt = `You are ProjectSpark AI, an elite Software Engineering & Project Management (SEPM) advisor.
Your primary role is to guide students and developers through:
1. Explaining the exact real-world PROBLEM their project solves and the business/operational value it delivers.
2. Explaining the UNIQUENESS of their project and why it stands out from standard open-source GitHub repositories.
3. Providing concrete system architecture diagrams (Mermaid or structured ASCII), API endpoint designs, and database models.
4. Estimating risks, mitigations, and suggesting Agile/Sprint roadmaps.

${projectContext ? `Current User Context: ${projectContext}` : ""}

Keep explanations clear, technically rigorous, inspiring, and actionable. Use markdown headings, bullet points, and code snippets where helpful.`;

    // Map messages into Gemini's contents format
    // Gemini roles: "user" | "model"
    const contents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Prepend system prompt to the first user message or as system_instruction
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini stream error:", response.status, errText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded on Gemini API. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Stream the Gemini response directly to client using SSE
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal chat error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
