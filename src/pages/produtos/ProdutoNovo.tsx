import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ProductForm, PRODUCT_FORM_DEFAULTS, productFormToInsert } from "@/components/products/ProductForm";
import { useCreateProductMutation } from "@/hooks/useProducts";

export default function ProdutoNovo() {
  const navigate = useNavigate();
  const createMutation = useCreateProductMutation();

  async function handleSubmit(values: Parameters<typeof productFormToInsert>[0]) {
    if (!values.slug.trim()) {
      toast.error("Informe o slug do sistema.");
      return;
    }
    try {
      const product = await createMutation.mutateAsync(productFormToInsert(values));
      toast.success("Sistema cadastrado.");
      navigate(`/produtos/sistemas/${product.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao cadastrar o sistema.");
    }
  }

  return (
    <>
      <PageHeader
        title="Novo sistema"
        description="Cadastre um novo produto licenciado. Ele ficará disponível no fluxo de novo contrato assim que estiver ativo."
        actions={
          <Button variant="outline" onClick={() => navigate("/produtos/sistemas")}>
            Voltar
          </Button>
        }
      />
      <div className="p-6 md:p-8">
        <ProductForm
          mode="create"
          defaultValues={PRODUCT_FORM_DEFAULTS}
          isSubmitting={createMutation.isPending}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
