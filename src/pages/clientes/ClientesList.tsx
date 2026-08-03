import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { DemoBadge } from "@/components/shared/DemoBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClientsQuery } from "@/hooks/useClients";

export default function ClientesList() {
  const [search, setSearch] = useState("");
  const { data: clients, isLoading } = useClientsQuery(search);

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Empresas e responsáveis cadastrados para uso em contratos."
        actions={
          <Button asChild>
            <Link to="/clientes/novo">
              <Plus className="mr-2 size-4" />
              Novo cliente
            </Link>
          </Button>
        }
      />

      <div className="space-y-4 p-6 md:p-8">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou CNPJ/CPF..."
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !clients || clients.length === 0 ? (
          <EmptyState
            icon={Users}
            title={search ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
            description={
              search ? "Tente buscar por outro termo." : "Cadastre o primeiro cliente para começar a gerar contratos."
            }
            action={
              !search ? (
                <Button asChild size="sm">
                  <Link to="/clientes/novo">
                    <Plus className="mr-2 size-4" />
                    Novo cliente
                  </Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome fantasia</TableHead>
                  <TableHead>Razão social</TableHead>
                  <TableHead>CNPJ/CPF</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="cursor-pointer">
                    <TableCell className="font-medium">
                      <Link to={`/clientes/${client.id}`} className="hover:underline">
                        {client.trade_name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.legal_name}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{client.document}</TableCell>
                    <TableCell className="text-muted-foreground">{client.contact_name}</TableCell>
                    <TableCell className="text-right">{client.is_demo && <DemoBadge />}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
