import { ProjectIdea } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid, List, Sparkles, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiskBadge } from "./RiskBadge";
import { SDLCBadge } from "./SDLCBadge";
import { UniquenessBar } from "./UniquenessBar";

interface ResultsDashboardProps {
  projects: ProjectIdea[];
  onAskAbout: (project: ProjectIdea) => void;
  isDemo?: boolean;
}

export function ResultsDashboard({ projects, onAskAbout, isDemo }: ResultsDashboardProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Recommended Project Ideas ({projects.length})
          </h2>
          {isDemo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
              <AlertCircle className="h-3 w-3" />
              Demo Mode Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border p-1 bg-card">
          <Button
            variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 px-3"
            onClick={() => setViewMode('cards')}
            title="Card View"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 px-3"
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="grid gap-5 md:grid-cols-1 xl:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onAskAbout={onAskAbout}
              index={index}
            />
          ))}
        </div>
      ) : (
        <Card className="border-border/50 shadow-md overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Project Comparison Matrix</CardTitle>
            <CardDescription>
              Compare problem scope, uniqueness, risk, effort, and SDLC models side-by-side
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Title & Problem Solved</TableHead>
                    <TableHead className="min-w-[140px]">Uniqueness vs GitHub</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Effort</TableHead>
                    <TableHead>SDLC</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">{project.title}</p>
                          {project.problemSolved && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              <span className="font-medium text-primary">Problem:</span> {project.problemSolved}
                            </p>
                          )}
                          {project.detailedMatches && project.detailedMatches.length > 0 && (
                            <div className="flex gap-1.5 pt-1">
                              {project.detailedMatches.slice(0, 2).map((m) => (
                                <a
                                  key={m.url}
                                  href={m.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary underline"
                                >
                                  {m.name} <ExternalLink className="h-2 w-2" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <UniquenessBar value={project.uniqueness} showLabel={true} />
                      </TableCell>
                      <TableCell>
                        <RiskBadge risk={project.risk} />
                      </TableCell>
                      <TableCell className="font-medium">{project.effort}w</TableCell>
                      <TableCell>
                        <SDLCBadge sdlc={project.sdlc} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary hover:text-primary-foreground text-xs"
                          onClick={() => onAskAbout(project)}
                        >
                          Ask Gemini
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
