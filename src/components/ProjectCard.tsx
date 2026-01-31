import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageCircle, Github } from "lucide-react";
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
      className="group overflow-hidden border-border/50 bg-card shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
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
        <CardDescription className="text-sm leading-relaxed line-clamp-3">
          {project.description}
        </CardDescription>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Uniqueness Score</p>
            <UniquenessBar value={project.uniqueness} />
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <SDLCBadge sdlc={project.sdlc} />
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                {project.effort}w
              </Badge>
            </div>
          </div>

          {project.githubMatches && project.githubMatches.length > 0 && (
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                <Github className="h-3 w-3" />
                Similar on GitHub
              </p>
              <div className="flex flex-wrap gap-1">
                {project.githubMatches.slice(0, 3).map((match) => (
                  <Badge key={match} variant="outline" className="text-xs">
                    {match}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={() => onAskAbout(project)}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Ask AI about this project
        </Button>
      </CardContent>
    </Card>
  );
}
