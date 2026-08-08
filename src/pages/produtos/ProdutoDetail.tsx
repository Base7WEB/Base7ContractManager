import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ProductForm, productToFormValues, productFormToInsert } from "@/components/products/ProductForm";
import { useProductQuery, useUpdateProductMutation } from "@/hooks/useProducts";

export default function ProdutoDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProductQuery(productId);
  const updateMutation = useUpdateProductMutation();

  async function handleSubmit(values: Parameters<typeof productFormToInsert>[0]) {
    if (!productId) return;
    try {
      await updateMutation.mutateAsync({ id: productId, ...productFormToInsert(values) });
      toast.success("Produto atualizado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao salvar.");
    }
  }

  if (isLoading || !product) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={product.name}
        description={`Slug: ${product.slug} — estas informações são carregadas automaticamente ao selecionar este sistema num novo contrato.`}
        actions={
          <Button variant="outline" onClick={() => navigate("/produtos/sistemas")}>
            Voltar
          </Button>
        }
      />
      <div className="p-6 md:p-8">
        <ProductForm
          mode="edit"
          defaultValues={productToFormValues(product)}
          isSubmitting={updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
