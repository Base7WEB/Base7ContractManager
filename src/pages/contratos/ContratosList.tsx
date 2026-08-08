import { Link } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { DemoBadge } from "@/components/shared/DemoBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useContractsQuery } from "@/hooks/useContracts";
import { CONTRACT_STATUS_LABEL } from "@/types/domain";
import { formatCurrencyBRL, formatDateBR } from "@/pdf/format";

export default function ContratosList() {
  const { data: contracts, isLoading } = useContractsQuery();

  return (
    <>
      <PageHeader
        title="Contratos"
        description="Histórico de contratos gerados pela Base7 Web."
        actions={
          <Button asChild>
            <Link to="/contratos/novo">
              <Plus className="mr-2 size-4" />
              Novo contrato
            </Link>
          </Button>
        }
      />

      <div className="p-6 md:p-8">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !contracts || contracts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhum contrato criado"
            description="Crie o primeiro contrato para gerar a documentação de um cliente."
            action={
              <Button asChild size="sm">
                <Link to="/contratos/novo">
                  <Plus className="mr-2 size-4" />
                  Novo contrato
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Sistema/Serviço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>CARE</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium tabular-nums">
                      <Link to={`/contratos/${contract.id}`} className="hover:underline">
                        {contract.number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2">
                        {contract.client.trade_name}
                        {contract.is_demo && <DemoBadge />}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contract.contract_kind === "sistema" ? contract.product?.name : contract.service?.name}
                    </TableCell>
                    <TableCell className="tabular-nums">{formatCurrencyBRL(contract.commercial.value)}</TableCell>
                    <TableCell className="text-muted-foreground">{contract.care ? "Ativo" : "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{CONTRACT_STATUS_LABEL[contract.status]}</Badge>
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {formatDateBR(contract.created_at.slice(0, 10))}
                    </TableCell>
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
