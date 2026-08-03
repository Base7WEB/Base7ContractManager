import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DemoBadge } from "@/components/shared/DemoBadge";
import { ClientForm } from "@/components/clients/ClientForm";
import { useClientQuery, useCreateClientMutation, useUpdateClientMutation } from "@/hooks/useClients";
import { clientFormToInsert, type ClientFormValues } from "@/lib/schemas/client";

export default function ClienteForm() {
  const { clientId } = useParams();
  const isEditing = Boolean(clientId);
  const navigate = useNavigate();

  const { data: client, isLoading } = useClientQuery(clientId);
  const createMutation = useCreateClientMutation();
  const updateMutation = useUpdateClientMutation();

  const formDefaults: Partial<ClientFormValues> | undefined = client
    ? {
        kind: client.kind,
        trade_name: client.trade_name,
        legal_name: client.legal_name,
        document: client.document,
        address_street: client.address_street ?? "",
        address_number: client.address_number ?? "",
        address_complement: client.address_complement ?? "",
        address_neighborhood: client.address_neighborhood ?? "",
        address_city: client.address_city ?? "",
        address_state: client.address_state ?? "",
        address_zip: client.address_zip ?? "",
        contact_name: client.contact_name,
        contact_role: client.contact_role ?? "",
        contact_document: client.contact_document ?? "",
        email: client.email ?? "",
        phone: client.phone ?? "",
        notes: client.notes ?? "",
      }
    : undefined;

  async function handleSubmit(values: ClientFormValues) {
    const payload = clientFormToInsert(values);

    try {
      if (isEditing && clientId) {
        await updateMutation.mutateAsync({ id: clientId, ...payload });
        toast.success("Cliente atualizado.");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Cliente cadastrado.");
      }
      navigate("/clientes");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao salvar o cliente.");
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
        title={isEditing ? client?.trade_name ?? "Editar cliente" : "Novo cliente"}
        description={isEditing ? "Atualize os dados cadastrais deste cliente." : "Cadastre um cliente para usar em contratos."}
        actions={client?.is_demo ? <DemoBadge /> : undefined}
      />
      <div className="max-w-4xl p-6 md:p-8">
        <ClientForm
          key={client?.id ?? "new"}
          defaultValues={formDefaults}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          submitLabel={isEditing ? "Salvar alterações" : "Cadastrar cliente"}
          onCancel={() => navigate("/clientes")}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
