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

const CUSTOM_VALUE = "__custom__";

export function ProjectForm({ onSubmit, isLoading }: ProjectFormProps) {
  const [domain, setDomain] = useState<string>("");
  const [customDomain, setCustomDomain] = useState<string>("");
  const [isCustomDomain, setIsCustomDomain] = useState(false);

  const [technology, setTechnology] = useState<string>("");
  const [customTechnology, setCustomTechnology] = useState<string>("");
  const [isCustomTechnology, setIsCustomTechnology] = useState(false);

  const [teamSize, setTeamSize] = useState<string>("3");
  const [duration, setDuration] = useState<string>("8");

  const handleDomainChange = (value: string) => {
    if (value === CUSTOM_VALUE) {
      setIsCustomDomain(true);
      setDomain("");
    } else {
      setIsCustomDomain(false);
      setCustomDomain("");
      setDomain(value);
    }
  };

  const handleTechnologyChange = (value: string) => {
    if (value === CUSTOM_VALUE) {
      setIsCustomTechnology(true);
      setTechnology("");
    } else {
      setIsCustomTechnology(false);
      setCustomTechnology("");
      setTechnology(value);
    }
  };

  const effectiveDomain = isCustomDomain ? customDomain.trim() : domain;
  const effectiveTechnology = isCustomTechnology ? customTechnology.trim() : technology;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveDomain || !effectiveTechnology) return;

    onSubmit({
      domain: effectiveDomain,
      teamSize: parseInt(teamSize),
      duration: parseInt(duration),
      technology: effectiveTechnology,
    });
  };

  const isValid = effectiveDomain && effectiveTechnology && teamSize && duration;

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
            {/* Domain / Industry */}
            <div className="space-y-2">
              <Label htmlFor="domain" className="flex items-center gap-2">
                <FolderSearch className="h-4 w-4 text-muted-foreground" />
                Domain / Industry
              </Label>
              {isCustomDomain ? (
                <div className="flex gap-2">
                  <Input
                    id="domain"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="e.g. Agriculture, Legal Tech, Logistics..."
                    autoFocus
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs h-10"
                    onClick={() => {
                      setIsCustomDomain(false);
                      setCustomDomain("");
                      setDomain("");
                    }}
                  >
                    Presets
                  </Button>
                </div>
              ) : (
                <Select value={domain} onValueChange={handleDomainChange}>
                  <SelectTrigger id="domain">
                    <SelectValue placeholder="Select a domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                    <SelectItem value={CUSTOM_VALUE} className="text-primary font-medium border-t border-border/50 mt-1">
                      ✏️ Enter custom domain...
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Preferred Technology */}
            <div className="space-y-2">
              <Label htmlFor="technology" className="flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                Preferred Technology
              </Label>
              {isCustomTechnology ? (
                <div className="flex gap-2">
                  <Input
                    id="technology"
                    value={customTechnology}
                    onChange={(e) => setCustomTechnology(e.target.value)}
                    placeholder="e.g. Rust + Actix, Go + gRPC, MERN..."
                    autoFocus
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs h-10"
                    onClick={() => {
                      setIsCustomTechnology(false);
                      setCustomTechnology("");
                      setTechnology("");
                    }}
                  >
                    Presets
                  </Button>
                </div>
              ) : (
                <Select value={technology} onValueChange={handleTechnologyChange}>
                  <SelectTrigger id="technology">
                    <SelectValue placeholder="Select technology stack" />
                  </SelectTrigger>
                  <SelectContent>
                    {TECHNOLOGIES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                    <SelectItem value={CUSTOM_VALUE} className="text-primary font-medium border-t border-border/50 mt-1">
                      ✏️ Enter custom technology...
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
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
