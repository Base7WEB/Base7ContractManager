import { Link } from "react-router-dom";
import { Boxes, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductsQuery } from "@/hooks/useProducts";
import { resolveIcon } from "@/lib/icons";

export default function ProdutosSistemas() {
  const { data: products, isLoading } = useProductsQuery();

  return (
    <>
      <PageHeader
        title="Sistemas"
        description="Produtos vendidos pela Base7 Web. Cadastrar um novo sistema aqui o disponibiliza no fluxo de novo contrato."
        actions={
          <Button asChild>
            <Link to="/produtos/sistemas/novo">
              <Plus className="mr-2 size-4" />
              Novo sistema
            </Link>
          </Button>
        }
      />
      <div className="p-6 md:p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title="Nenhum sistema cadastrado"
            description="Cadastre o primeiro sistema para disponibilizá-lo no fluxo de novo contrato."
            action={
              <Button asChild size="sm">
                <Link to="/produtos/sistemas/novo">
                  <Plus className="mr-2 size-4" />
                  Novo sistema
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const Icon = resolveIcon(product.icon);
              return (
                <Link key={product.id} to={`/produtos/sistemas/${product.id}`}>
                  <Card className="h-full transition-colors hover:border-primary/40 hover:shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Icon className="size-4 shrink-0 text-primary" />
                          {product.name}
                        </CardTitle>
                        <Badge variant={product.status === "active" ? "default" : "secondary"} className="shrink-0">
                          {product.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                      <p className="text-xs text-muted-foreground">Versão padrão: {product.default_version}</p>
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
