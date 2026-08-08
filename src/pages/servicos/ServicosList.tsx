import { Link } from "react-router-dom";
import { Briefcase, Check, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useServicesQuery } from "@/hooks/useServices";
import { resolveIcon } from "@/lib/icons";
import { SERVICE_CATEGORY_LABEL } from "@/types/domain";
import { formatCurrencyBRL } from "@/pdf/format";

export default function ServicosList() {
  const { data: services, isLoading } = useServicesQuery();

  return (
    <>
      <PageHeader
        title="Serviços"
        description="Pacotes de serviços da Base7 Web (tráfego pago, landing pages, sites institucionais, automações etc.)."
        actions={
          <Button asChild>
            <Link to="/servicos/novo">
              <Plus className="mr-2 size-4" />
              Adicionar Serviço
            </Link>
          </Button>
        }
      />
      <div className="p-6 md:p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        ) : !services || services.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Nenhum serviço cadastrado"
            description="Adicione o primeiro serviço para disponibilizá-lo no fluxo de novo contrato."
            action={
              <Button asChild size="sm">
                <Link to="/servicos/novo">
                  <Plus className="mr-2 size-4" />
                  Adicionar Serviço
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = resolveIcon(service.icon, Briefcase);
              return (
                <Link key={service.id} to={`/servicos/${service.id}`}>
                  <Card
                    className={`h-full transition-colors hover:border-primary/40 hover:shadow-sm ${
                      service.badge ? "border-primary/50 shadow-sm" : ""
                    }`}
                  >
                    <CardHeader className="space-y-2 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex items-center gap-2 text-base font-semibold text-foreground">
                          <Icon className="size-4 shrink-0 text-primary" />
                          {service.name}
                        </span>
                        <Badge variant={service.status === "active" ? "default" : "secondary"} className="shrink-0">
                          {service.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      {service.badge && (
                        <Badge variant="outline" className="w-fit border-primary/50 text-primary">
                          {service.badge}
                        </Badge>
                      )}
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {SERVICE_CATEGORY_LABEL[service.category]}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-2xl font-bold text-foreground">
                          {service.price_prefix && `${service.price_prefix} `}
                          {formatCurrencyBRL(service.price)}
                        </span>
                        {service.price_period === "mensal" && (
                          <span className="text-sm text-muted-foreground"> / mês</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{service.tagline}</p>
                      <ul className="space-y-1">
                        {service.items.slice(0, 4).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Check className="mt-0.5 size-3 shrink-0 text-primary" />
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                        {service.items.length > 4 && (
                          <li className="text-xs text-muted-foreground">+ {service.items.length - 4} itens</li>
                        )}
                      </ul>
                      <p className="text-xs text-muted-foreground">{service.delivery_text}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
