import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Boxes } from "lucide-react";
import { useActiveProductsQuery, type ProductRow } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

interface ProductPickerProps {
  value: ProductRow | null;
  onChange: (product: ProductRow) => void;
}

export function ProductPicker({ value, onChange }: ProductPickerProps) {
  const { data: products, isLoading } = useActiveProductsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={Boxes}
        title="Nenhum sistema ativo"
        description="Cadastre ou ative um produto em Produtos > Sistemas antes de criar um contrato."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {products.map((product) => {
        const selected = value?.id === product.id;
        return (
          <Card
            key={product.id}
            role="button"
            tabIndex={0}
            onClick={() => onChange(product)}
            onKeyDown={(e) => e.key === "Enter" && onChange(product)}
            className={cn(
              "cursor-pointer transition-colors hover:border-primary/40",
              selected && "border-primary ring-1 ring-primary",
            )}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-base">{product.name}</CardTitle>
              {selected && (
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
