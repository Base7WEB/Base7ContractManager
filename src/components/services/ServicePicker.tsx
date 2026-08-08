import { Briefcase, Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useActiveServicesQuery, type ServiceRow } from "@/hooks/useServices";
import { resolveIcon } from "@/lib/icons";
import { formatCurrencyBRL } from "@/pdf/format";
import { cn } from "@/lib/utils";

interface ServicePickerProps {
  value: ServiceRow | null;
  onChange: (service: ServiceRow) => void;
}

export function ServicePicker({ value, onChange }: ServicePickerProps) {
  const { data: services, isLoading } = useActiveServicesQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Nenhum serviço ativo"
        description="Cadastre ou ative um serviço em Serviços antes de criar um contrato."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {services.map((service) => {
        const selected = value?.id === service.id;
        const Icon = resolveIcon(service.icon, Briefcase);
        return (
          <Card
            key={service.id}
            role="button"
            tabIndex={0}
            onClick={() => onChange(service)}
            onKeyDown={(e) => e.key === "Enter" && onChange(service)}
            className={cn(
              "cursor-pointer transition-colors hover:border-primary/40",
              selected && "border-primary ring-1 ring-primary",
            )}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <span className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Icon className="size-4 shrink-0 text-primary" />
                {service.name}
                {service.badge && (
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    {service.badge}
                  </Badge>
                )}
              </span>
              {selected && (
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" />
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {service.price_prefix && `${service.price_prefix} `}
                {formatCurrencyBRL(service.price)}
                {service.price_period === "mensal" && <span className="text-muted-foreground"> / mês</span>}
              </p>
              <p className="line-clamp-2 text-sm text-muted-foreground">{service.tagline}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
