import { toast } from "sonner";
import { Download, FolderOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAllDocumentVersionsQuery } from "@/hooks/useGeneratedDocuments";
import { getSignedDownloadUrl } from "@/lib/documents";
import { DOCUMENT_TYPE_LABEL } from "@/types/domain";
import { formatDateBR } from "@/pdf/format";

export default function Documentacoes() {
  const { data: rows, isLoading } = useAllDocumentVersionsQuery();

  async function handleDownload(storagePath: string) {
    try {
      const url = await getSignedDownloadUrl(storagePath);
      window.open(url, "_blank");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao gerar link de download.");
    }
  }

  return (
    <>
      <PageHeader title="Documentações" description="Todos os documentos já gerados, em todos os contratos." />
      <div className="p-6 md:p-8">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !rows || rows.length === 0 ? (
          <EmptyState icon={FolderOpen} title="Nenhum documento gerado ainda" description="Gere documentação a partir de um contrato para vê-la aqui." />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Versão</TableHead>
                  <TableHead>Gerado em</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ version, document, contract, client }) => (
                  <TableRow key={version.id}>
                    <TableCell className="font-medium tabular-nums">{contract?.number ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{client?.trade_name ?? "—"}</TableCell>
                    <TableCell>{document ? DOCUMENT_TYPE_LABEL[document.document_type] : "—"}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">v{version.version_number}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {formatDateBR(version.generated_at.slice(0, 10))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => handleDownload(version.storage_path)}>
                        <Download className="size-3.5" />
                      </Button>
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
