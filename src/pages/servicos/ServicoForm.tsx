import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  ServiceForm,
  SERVICE_FORM_DEFAULTS,
  serviceToFormValues,
  serviceFormToInsert,
  type ServiceFormValues,
} from "@/components/services/ServiceForm";
import { useServiceQuery, useCreateServiceMutation, useUpdateServiceMutation } from "@/hooks/useServices";

export default function ServicoForm() {
  const { serviceId } = useParams();
  const isEditing = Boolean(serviceId);
  const navigate = useNavigate();

  const { data: service, isLoading } = useServiceQuery(serviceId);
  const createMutation = useCreateServiceMutation();
  const updateMutation = useUpdateServiceMutation();

  async function handleSubmit(values: ServiceFormValues) {
    if (!values.slug.trim()) {
      toast.error("Informe o slug do serviço.");
      return;
    }
    try {
      if (isEditing && serviceId) {
        await updateMutation.mutateAsync({ id: serviceId, ...serviceFormToInsert(values) });
        toast.success("Serviço atualizado.");
        navigate(`/servicos/${serviceId}`);
      } else {
        const created = await createMutation.mutateAsync(serviceFormToInsert(values));
        toast.success("Serviço cadastrado.");
        navigate(`/servicos/${created.id}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao salvar o serviço.");
    }
  }

  if (isEditing && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={isEditing ? service?.name ?? "Editar serviço" : "Adicionar Serviço"}
        description={
          isEditing
            ? "Atualize os dados deste serviço. Alterações não afetam contratos já gerados (o texto fica congelado no snapshot)."
            : "Cadastre um novo serviço. Ele ficará disponível no fluxo de novo contrato assim que estiver ativo."
        }
        actions={
          <Button variant="outline" onClick={() => navigate("/servicos")}>
            Voltar
          </Button>
        }
      />
      <div className="p-6 md:p-8">
        <ServiceForm
          mode={isEditing ? "edit" : "create"}
          defaultValues={service ? serviceToFormValues(service) : SERVICE_FORM_DEFAULTS}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
