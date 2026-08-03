import { useState } from "react";
import { Building2, Check, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientForm } from "@/components/clients/ClientForm";
import { useClientsQuery, useCreateClientMutation, type ClientRow } from "@/hooks/useClients";
import { clientFormToInsert, type ClientFormValues } from "@/lib/schemas/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ClientPickerProps {
  value: ClientRow | null;
  onChange: (client: ClientRow) => void;
}

export function ClientPicker({ value, onChange }: ClientPickerProps) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: clients, isLoading } = useClientsQuery(search);
  const createMutation = useCreateClientMutation();

  async function handleCreate(values: ClientFormValues) {
    try {
      const client = await createMutation.mutateAsync(clientFormToInsert(values));
      toast.success("Cliente cadastrado.");
      onChange(client);
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao cadastrar cliente.");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente por nome ou CNPJ/CPF..."
            className="pl-9"
          />
        </div>
        <Button type="button" variant="outline" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          Novo cliente
        </Button>
      </div>

      <ScrollArea className="h-72 rounded-lg border border-border">
        <div className="divide-y divide-border">
          {isLoading && <p className="p-4 text-sm text-muted-foreground">Carregando...</p>}
          {!isLoading && (!clients || clients.length === 0) && (
            <p className="p-4 text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
          )}
          {clients?.map((client) => {
            const selected = value?.id === client.id;
            return (
              <button
                type="button"
                key={client.id}
                onClick={() => onChange(client)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/60",
                  selected && "bg-accent",
                )}
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Building2 className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{client.trade_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {client.legal_name} · {client.document}
                  </p>
                </div>
                {selected && <Check className="size-4 shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo cliente</DialogTitle>
          </DialogHeader>
          <ClientForm
            isSubmitting={createMutation.isPending}
            submitLabel="Cadastrar e selecionar"
            onSubmit={handleCreate}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
