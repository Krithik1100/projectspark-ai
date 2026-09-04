import { Lightbulb, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-glow">
            <Lightbulb className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                ProjectSpark AI
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary border border-primary/20">
                <Sparkles className="h-2.5 w-2.5" />
                Gemini Powered
              </span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Project Title Recommender & GitHub Uniqueness Analyzer
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
