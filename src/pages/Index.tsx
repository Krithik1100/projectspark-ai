import { Header } from "@/components/Header";
import { ProjectForm } from "@/components/ProjectForm";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ChatPanel } from "@/components/ChatPanel";
import { useProjectRecommender } from "@/hooks/useProjectRecommender";
import { GraduationCap, Lightbulb, Shield, GitBranch } from "lucide-react";

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


      <main className="container py-8">
        {/* Hero Section */}
        <section className="mb-10 text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-3">
            Intelligent Project Title Recommender
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            AI-powered project ideas with GitHub uniqueness checks, risk assessment, and SDLC recommendations for your SEPM course.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span>AI-Generated Ideas</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              <span>GitHub Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Risk Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>SEPM Aligned</span>
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
          <p>Built for Software Engineering Project Management • Powered by AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
