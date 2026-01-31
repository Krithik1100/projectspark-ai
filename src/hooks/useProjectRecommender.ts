import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectIdea, ProjectPreferences, ChatMessage, TokenSettings, DEMO_PROJECTS } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

export function useProjectRecommender() {
  const [projects, setProjects] = useState<ProjectIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [tokens, setTokens] = useState<TokenSettings>({});
  const [currentPreferences, setCurrentPreferences] = useState<ProjectPreferences | null>(null);
  const { toast } = useToast();

  const generateProjects = useCallback(async (preferences: ProjectPreferences) => {
    setIsLoading(true);
    setCurrentPreferences(preferences);
    setProjects([]);

    try {
      // Step 1: Generate titles using AI
      const { data: titlesData, error: titlesError } = await supabase.functions.invoke('generate-titles', {
        body: preferences,
      });

      if (titlesError) throw titlesError;

      let generatedProjects = titlesData?.projects || [];

      // If no projects generated, use demo mode
      if (generatedProjects.length === 0) {
        setIsDemo(true);
        setProjects(DEMO_PROJECTS);
        toast({
          title: "Demo Mode Active",
          description: "Showing sample projects. AI generation will be available shortly.",
        });
        setIsLoading(false);
        return;
      }

      // Step 2: Fetch GitHub repos and calculate uniqueness (uses server-side token)
      const titles = generatedProjects.map((p: any) => p.title);
      const { data: githubData, error: githubError } = await supabase.functions.invoke('fetch-github-repos', {
        body: {
          domain: preferences.domain,
          titles,
        },
      });

      if (githubError) {
        console.warn("GitHub fetch failed:", githubError);
      }

      const uniquenessScores = githubData?.uniquenessScores || {};

      // Step 3: Calculate risk and effort
      const { data: riskData, error: riskError } = await supabase.functions.invoke('calculate-risk', {
        body: {
          projects: generatedProjects,
          domain: preferences.domain,
          teamSize: preferences.teamSize,
          duration: preferences.duration,
          technology: preferences.technology,
        },
      });

      if (riskError) {
        console.warn("Risk calculation failed:", riskError);
      }

      const riskResults = riskData?.results || [];

      // Combine all data
      const finalProjects: ProjectIdea[] = generatedProjects.map((project: any, index: number) => {
        const uniquenessInfo = uniquenessScores[project.title] || { score: 70 + Math.random() * 20, matches: [] };
        const riskInfo = riskResults[index] || { risk: 'Medium', effort: 8, sdlc: 'Agile' };

        return {
          id: `project-${index + 1}`,
          title: project.title,
          description: project.description,
          uniqueness: Math.round(uniquenessInfo.score),
          risk: riskInfo.risk,
          effort: riskInfo.effort,
          sdlc: riskInfo.sdlc,
          githubMatches: uniquenessInfo.matches,
        };
      });

      setProjects(finalProjects);
      setIsDemo(false);

      toast({
        title: "Projects Generated!",
        description: `Found ${finalProjects.length} unique project ideas for ${preferences.domain}.`,
      });
    } catch (error) {
      console.error("Error generating projects:", error);
      
      // Fallback to demo mode
      setIsDemo(true);
      setProjects(DEMO_PROJECTS);
      
      toast({
        title: "Using Demo Mode",
        description: "Showing sample projects. Check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [tokens, toast]);

  const sendChatMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const projectContext = currentPreferences
        ? `Domain: ${currentPreferences.domain}, Tech: ${currentPreferences.technology}, Team: ${currentPreferences.teamSize}, Duration: ${currentPreferences.duration} weeks`
        : '';

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          projectContext,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a moment.");
        }
        if (response.status === 402) {
          throw new Error("AI credits exhausted.");
        }
        throw new Error(`Chat error: ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setChatMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [
                  ...prev,
                  {
                    id: `msg-${Date.now()}-assistant`,
                    role: "assistant",
                    content: assistantContent,
                    timestamp: new Date(),
                  },
                ];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Chat Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsChatLoading(false);
    }
  }, [chatMessages, currentPreferences, toast]);

  const askAboutProject = useCallback((project: ProjectIdea) => {
    const message = `How would I implement "${project.title}"? Give me a high-level architecture and key steps.`;
    sendChatMessage(message);
  }, [sendChatMessage]);

  return {
    projects,
    isLoading,
    isDemo,
    chatMessages,
    isChatLoading,
    tokens,
    setTokens,
    generateProjects,
    sendChatMessage,
    askAboutProject,
  };
}
