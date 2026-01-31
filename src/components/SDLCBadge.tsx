import { cn } from "@/lib/utils";
import { IterationCw, ArrowDown, RefreshCcw } from "lucide-react";

interface SDLCBadgeProps {
  sdlc: 'Agile' | 'Waterfall' | 'Iterative';
  className?: string;
}

export function SDLCBadge({ sdlc, className }: SDLCBadgeProps) {
  const config = {
    Agile: {
      icon: IterationCw,
      bgClass: "bg-primary/10",
      textClass: "text-primary",
      borderClass: "border-primary/20",
    },
    Waterfall: {
      icon: ArrowDown,
      bgClass: "bg-accent/10",
      textClass: "text-accent",
      borderClass: "border-accent/20",
    },
    Iterative: {
      icon: RefreshCcw,
      bgClass: "bg-muted",
      textClass: "text-muted-foreground",
      borderClass: "border-border",
    },
  };

  const { icon: Icon, bgClass, textClass, borderClass } = config[sdlc];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        bgClass,
        textClass,
        borderClass,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {sdlc}
    </div>
  );
}
