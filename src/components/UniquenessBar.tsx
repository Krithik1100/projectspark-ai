import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface UniquenessBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function UniquenessBar({ value, className, showLabel = true }: UniquenessBarProps) {
  const getColorClass = () => {
    if (value >= 75) return "bg-success";
    if (value >= 50) return "bg-warning";
    return "bg-destructive";
  };

  const getLabel = () => {
    if (value >= 75) return "Highly Unique";
    if (value >= 50) return "Moderately Unique";
    return "Low Uniqueness";
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{value}%</span>
        {showLabel && (
          <span className="text-muted-foreground">{getLabel()}</span>
        )}
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            getColorClass()
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
