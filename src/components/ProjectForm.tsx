import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Users, Clock, Code, FolderSearch } from "lucide-react";
import { ProjectPreferences } from "@/types/project";

interface ProjectFormProps {
  onSubmit: (preferences: ProjectPreferences) => void;
  isLoading: boolean;
}

const DOMAINS = [
  "Healthcare",
  "Education",
  "E-Commerce",
  "Finance",
  "Social Media",
  "IoT / Smart Home",
  "Gaming",
  "Productivity",
  "Transportation",
  "Environmental",
];

const TECHNOLOGIES = [
  "React + Node.js",
  "Python + Django",
  "Java + Spring Boot",
  "Flutter + Firebase",
  "Vue.js + Express",
  "Angular + .NET",
  "React Native",
  "Next.js + PostgreSQL",
];

export function ProjectForm({ onSubmit, isLoading }: ProjectFormProps) {
  const [domain, setDomain] = useState<string>("");
  const [teamSize, setTeamSize] = useState<string>("3");
  const [duration, setDuration] = useState<string>("8");
  const [technology, setTechnology] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain || !technology) return;

    onSubmit({
      domain,
      teamSize: parseInt(teamSize),
      duration: parseInt(duration),
      technology,
    });
  };

  const isValid = domain && technology && teamSize && duration;

  return (
    <Card className="shadow-lg border-border/50 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FolderSearch className="h-5 w-5 text-primary" />
          Project Preferences
        </CardTitle>
        <CardDescription>
          Tell us about your project requirements to get AI-powered recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="domain" className="flex items-center gap-2">
                <FolderSearch className="h-4 w-4 text-muted-foreground" />
                Domain / Industry
              </Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger id="domain">
                  <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent>
                  {DOMAINS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technology" className="flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                Preferred Technology
              </Label>
              <Select value={technology} onValueChange={setTechnology}>
                <SelectTrigger id="technology">
                  <SelectValue placeholder="Select technology stack" />
                </SelectTrigger>
                <SelectContent>
                  {TECHNOLOGIES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-size" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Team Size
              </Label>
              <Input
                id="team-size"
                type="number"
                min={1}
                max={10}
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="Number of team members"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Duration (weeks)
              </Label>
              <Input
                id="duration"
                type="number"
                min={2}
                max={24}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Project duration in weeks"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary text-primary-foreground shadow-glow hover:shadow-xl transition-all duration-300"
            size="lg"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Project Ideas
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
