import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface RiskBadgeProps {
  risk: 'Low' | 'Medium' | 'High';
  className?: string;
}

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  const config = {
    Low: {
      icon: CheckCircle,
      bgClass: "bg-success/10",
      textClass: "text-success",
      borderClass: "border-success/20",
    },
    Medium: {
      icon: AlertCircle,
      bgClass: "bg-warning/10",
      textClass: "text-warning",
      borderClass: "border-warning/20",
    },
    High: {
      icon: AlertTriangle,
      bgClass: "bg-destructive/10",
      textClass: "text-destructive",
      borderClass: "border-destructive/20",
    },
  };

  const { icon: Icon, bgClass, textClass, borderClass } = config[risk];

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
      {risk} Risk
    </div>
  );
}
