import { Settings, Lightbulb, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { TokenSettings } from "@/types/project";

interface HeaderProps {
  tokens: TokenSettings;
  onTokensChange: (tokens: TokenSettings) => void;
}

export function Header({ tokens, onTokensChange }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [hfToken, setHfToken] = useState(tokens.huggingFaceToken || '');
  const [ghToken, setGhToken] = useState(tokens.githubToken || '');

  const handleSave = () => {
    onTokensChange({
      huggingFaceToken: hfToken || undefined,
      githubToken: ghToken || undefined,
    });
    setOpen(false);
  };

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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>API Token Settings</DialogTitle>
              <DialogDescription>
                Enter your API tokens for enhanced functionality. Leave blank to use demo mode with AI-powered suggestions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="github-token">GitHub Token (Optional)</Label>
                <Input
                  id="github-token"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxx"
                  value={ghToken}
                  onChange={(e) => setGhToken(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Used for searching public repositories. Without it, demo data will be shown.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hf-token">Hugging Face Token (Optional)</Label>
                <Input
                  id="hf-token"
                  type="password"
                  placeholder="hf_xxxxxxxxxxxx"
                  value={hfToken}
                  onChange={(e) => setHfToken(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Optional for external model access. App uses built-in AI by default.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Settings</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
