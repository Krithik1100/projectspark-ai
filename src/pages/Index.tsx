import { Header } from "@/components/Header";
import { ProjectForm } from "@/components/ProjectForm";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ChatPanel } from "@/components/ChatPanel";
import { useProjectRecommender } from "@/hooks/useProjectRecommender";
import { GraduationCap, Lightbulb, Shield, GitBranch, Target } from "lucide-react";

const Index = () => {
  const {
    projects,
    isLoading,
    isDemo,
    chatMessages,
    isChatLoading,
    generateProjects,
    sendChatMessage,
    askAboutProject,
  } = useProjectRecommender();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-10 text-center animate-fade-in">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-3">
            Intelligent Project Title Recommender
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Get academic project recommendations powered by Google Gemini AI, verified against public GitHub repository data for uniqueness and core problem clarity.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span>Gemini AI Ideation</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span>Core Problem Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              <span>GitHub Public Repo Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Risk & SDLC Advisor</span>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Form & Results */}
          <div className="lg:col-span-2 space-y-8">
            <ProjectForm onSubmit={generateProjects} isLoading={isLoading} />
            <ResultsDashboard
              projects={projects}
              onAskAbout={askAboutProject}
              isDemo={isDemo}
            />
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ChatPanel
                messages={chatMessages}
                onSendMessage={sendChatMessage}
                isLoading={isChatLoading}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>ProjectSpark AI • Powered by Google Gemini AI & GitHub Public API</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
