import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DemoBadge() {
  return (
    <Badge
      variant="outline"
      className="gap-1 border-amber-300 bg-amber-50 text-[11px] font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400"
    >
      <Sparkles className="size-3" />
      Dados fictícios — demonstração
    </Badge>
  );
}
