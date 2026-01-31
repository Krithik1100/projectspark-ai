import { ProjectIdea } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid, List, Sparkles, AlertCircle } from "lucide-react";
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
            Generated Project Ideas
          </h2>
          {isDemo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs text-warning border border-warning/20">
              <AlertCircle className="h-3 w-3" />
              Demo Mode
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          <Button
            variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 px-3"
            onClick={() => setViewMode('cards')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 px-3"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Project Comparison</CardTitle>
            <CardDescription>
              Compare all generated projects at a glance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="min-w-[120px]">Uniqueness</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Effort</TableHead>
                    <TableHead>SDLC</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.title}
                      </TableCell>
                      <TableCell>
                        <UniquenessBar value={project.uniqueness} showLabel={false} />
                      </TableCell>
                      <TableCell>
                        <RiskBadge risk={project.risk} />
                      </TableCell>
                      <TableCell>{project.effort}w</TableCell>
                      <TableCell>
                        <SDLCBadge sdlc={project.sdlc} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAskAbout(project)}
                        >
                          Ask AI
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
