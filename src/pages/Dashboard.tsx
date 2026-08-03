import { Link } from "react-router-dom";
import { FileText, FolderOpen, Heart, Plus, UserPlus, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClientsQuery } from "@/hooks/useClients";
import { useContractsQuery } from "@/hooks/useContracts";
import { useAllDocumentVersionsQuery } from "@/hooks/useGeneratedDocuments";
import { CONTRACT_STATUS_LABEL } from "@/types/domain";
import { formatCurrencyBRL } from "@/pdf/format";

export default function Dashboard() {
  const { data: clients, isLoading: loadingClients } = useClientsQuery();
  const { data: contracts, isLoading: loadingContracts } = useContractsQuery();
  const { data: versions, isLoading: loadingVersions } = useAllDocumentVersionsQuery();

  const loading = loadingClients || loadingContracts || loadingVersions;

  const stats = [
    { label: "Clientes", value: clients?.length, icon: Users },
    { label: "Contratos", value: contracts?.length, icon: FileText },
    { label: "Documentações geradas", value: versions?.length, icon: FolderOpen },
    { label: "BASE7 CARE ativos", value: contracts?.filter((c) => c.care?.active).length, icon: Heart },
  ];

  const recentContracts = contracts?.slice(0, 6) ?? [];

  return (
    <>
      <PageHeader title="Dashboard" description="Visão geral do BASE7 Contract Manager." />
      <div className="space-y-6 p-6 md:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                  {loading ? (
                    <Skeleton className="mt-2 h-8 w-12" />
                  ) : (
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{stat.value ?? 0}</p>
                  )}
                </div>
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="size-4 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Contratos recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : recentContracts.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Nenhum contrato ainda"
                  description="Crie o primeiro contrato para vê-lo aqui."
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
                <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contrato</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium tabular-nums">
                          <Link to={`/contratos/${contract.id}`} className="hover:underline">
                            {contract.number}
                          </Link>
                        </TableCell>
                        <TableCell className="max-w-[160px] truncate" title={contract.client.trade_name}>
                          {contract.client.trade_name}
                          {contract.is_demo && <span className="ml-1.5 text-amber-600 dark:text-amber-400">*</span>}
                        </TableCell>
                        <TableCell className="tabular-nums">{formatCurrencyBRL(contract.commercial.value)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{CONTRACT_STATUS_LABEL[contract.status]}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {recentContracts.some((c) => c.is_demo) && (
                  <p className="mt-2 text-xs text-muted-foreground">* dados fictícios — demonstração</p>
                )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ações rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/clientes/novo">
                  <UserPlus className="mr-2 size-4" />
                  Novo cliente
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/contratos/novo">
                  <FileText className="mr-2 size-4" />
                  Novo contrato
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/contratos">
                  <FolderOpen className="mr-2 size-4" />
                  Gerar documentação
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
