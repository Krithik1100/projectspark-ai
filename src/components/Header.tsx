import { Lightbulb, GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-glow">
            <Lightbulb className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Project Recommender
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              SEPM Risk Advisor
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
