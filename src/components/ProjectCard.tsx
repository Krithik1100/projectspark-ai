import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageCircle, Github, Lightbulb, Target, ExternalLink } from "lucide-react";
import { ProjectIdea } from "@/types/project";
import { RiskBadge } from "./RiskBadge";
import { UniquenessBar } from "./UniquenessBar";
import { SDLCBadge } from "./SDLCBadge";

interface ProjectCardProps {
  project: ProjectIdea;
  onAskAbout: (project: ProjectIdea) => void;
  index: number;
}

export function ProjectCard({ project, onAskAbout, index }: ProjectCardProps) {
  return (
    <Card 
      className="group overflow-hidden border-border/60 bg-card shadow-md hover:shadow-xl transition-all duration-300 animate-slide-up flex flex-col justify-between"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 flex-1 min-w-0">
              <CardTitle className="text-base font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
            </div>
            <RiskBadge risk={project.risk} />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <CardDescription className="text-sm leading-relaxed">
            {project.description}
          </CardDescription>

          {/* Core Problem Solved Section */}
          {project.problemSolved && (
            <div className="rounded-lg bg-primary/5 border border-primary/15 p-2.5 text-xs text-foreground/90 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-primary">
                <Target className="h-3.5 w-3.5 shrink-0" />
                <span>Core Problem Solved:</span>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-5">
                {project.problemSolved}
              </p>
            </div>
          )}

          {/* Uniqueness Factor Section */}
          {project.uniquenessFactor && (
            <div className="rounded-lg bg-amber-500/5 border border-amber-500/15 p-2.5 text-xs text-foreground/90 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                <span>Why It's Unique:</span>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-5">
                {project.uniquenessFactor}
              </p>
            </div>
          )}

          <div className="space-y-3 pt-1">
            <div>
              <p className="text-xs text-muted-foreground mb-1">GitHub Uniqueness Score</p>
              <UniquenessBar value={project.uniqueness} />
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <SDLCBadge sdlc={project.sdlc} />
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {project.effort} weeks
                </Badge>
              </div>
            </div>

            {/* Similar GitHub Repositories */}
            {project.detailedMatches && project.detailedMatches.length > 0 ? (
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Github className="h-3 w-3" />
                    Similar Public Repos on GitHub:
                  </span>
                </p>
                <div className="flex flex-col gap-1.5">
                  {project.detailedMatches.slice(0, 3).map((match) => (
                    <a
                      key={match.fullName || match.name}
                      href={match.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-xs px-2 py-1 rounded bg-muted/60 hover:bg-muted transition-colors border border-border/40 text-foreground/80 hover:text-primary"
                    >
                      <span className="truncate max-w-[180px] font-mono">{match.fullName || match.name}</span>
                      <span className="flex items-center gap-1 text-muted-foreground shrink-0 text-[10px]">
                        ★ {match.stars}
                        <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ) : project.githubMatches && project.githubMatches.length > 0 ? (
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Github className="h-3 w-3" />
                  Similar GitHub Keywords:
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.githubMatches.slice(0, 3).map((match) => (
                    <Badge key={match} variant="outline" className="text-[11px]">
                      {match}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </div>

      <div className="p-6 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          onClick={() => onAskAbout(project)}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Explain in Chat (AI)
        </Button>
      </div>
    </Card>
  );
}
