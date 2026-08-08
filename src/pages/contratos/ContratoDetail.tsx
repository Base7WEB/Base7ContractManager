import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, FileText, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DemoBadge } from "@/components/shared/DemoBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useContractQuery } from "@/hooks/useContracts";
import { useContractDocumentsQuery, invalidateContractDocuments } from "@/hooks/useGeneratedDocuments";
import { generateDocument, getSignedDownloadUrl } from "@/lib/documents";
import { CONTRACT_STATUS_LABEL, DOCUMENT_TYPE_LABEL, type DocumentType } from "@/types/domain";
import { formatCurrencyBRL, formatDateBR } from "@/pdf/format";

const INDIVIDUAL_DOCS_SISTEMA: DocumentType[] = [
  "contrato",
  "termo_entrega",
  "manual",
  "doc_tecnica",
  "acessos",
  "backup",
  "checklist",
];

const INDIVIDUAL_DOCS_SERVICO: DocumentType[] = ["contrato_servico"];

export default function ContratoDetail() {
  const { contractId } = useParams();
  const { data: contract, isLoading } = useContractQuery(contractId);
  const { data: documents } = useContractDocumentsQuery(contractId);
  const queryClient = useQueryClient();

  const [generating, setGenerating] = useState<DocumentType | null>(null);

  async function handleGenerate(type: DocumentType) {
    if (!contractId) return;
    // Abre a aba de forma síncrona, dentro do gesto de clique do usuário — se esperarmos a
    // função assíncrona terminar antes de chamar window.open, o navegador trata como popup
    // não solicitado e bloqueia silenciosamente.
    const pendingTab = window.open("", "_blank");
    setGenerating(type);
    try {
      const result = await generateDocument(contractId, type);
      toast.success(`${DOCUMENT_TYPE_LABEL[type]} gerado (versão ${result.version}).`);
      invalidateContractDocuments(queryClient, contractId);
      if (pendingTab) pendingTab.location.href = result.url;
    } catch (err) {
      pendingTab?.close();
      toast.error(err instanceof Error ? err.message : "Falha ao gerar documento.");
    } finally {
      setGenerating(null);
    }
  }

  async function handleDownload(storagePath: string) {
    const pendingTab = window.open("", "_blank");
    try {
      const url = await getSignedDownloadUrl(storagePath);
      if (pendingTab) pendingTab.location.href = url;
    } catch (err) {
      pendingTab?.close();
      toast.error(err instanceof Error ? err.message : "Falha ao gerar link de download.");
    }
  }

  if (isLoading || !contract) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const commercial = contract.commercial;
  const care = contract.care;
  const isSistema = contract.contract_kind === "sistema";
  const subjectName = isSistema ? (contract.product?.name ?? "—") : (contract.service?.name ?? "—");
  const individualDocs = isSistema ? INDIVIDUAL_DOCS_SISTEMA : INDIVIDUAL_DOCS_SERVICO;

  return (
    <>
      <PageHeader
        title={`Contrato ${contract.number}`}
        description={`${contract.client.trade_name} — ${subjectName}`}
        actions={
          <div className="flex items-center gap-2">
            {contract.is_demo && <DemoBadge />}
            <Badge variant="outline">{CONTRACT_STATUS_LABEL[contract.status]}</Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 p-6 md:p-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Cliente" value={contract.client.trade_name} />
              <Row label="Razão social" value={contract.client.legal_name} />
              <Row label={isSistema ? "Sistema" : "Serviço"} value={subjectName} />
              <Separator />
              <Row label="Valor" value={`${formatCurrencyBRL(commercial.value)} — ${commercial.payment_method}`} />
              <Row label="Prazo" value={`${commercial.term_days} dias`} />
              <Row label="Início" value={formatDateBR(commercial.start_date)} />
              <Row label="Entrega" value={formatDateBR(commercial.delivery_date)} />
              {isSistema && commercial.system_version && <Row label="Versão" value={commercial.system_version} />}
              {isSistema && commercial.subdomain && <Row label="Domínio" value={commercial.subdomain} />}
              {isSistema && (
                <>
                  <Separator />
                  <Row label="BASE7 CARE" value={care ? `${formatCurrencyBRL(care.monthly_price)}/mês` : "Não contratado"} />
                </>
              )}
            </CardContent>
          </Card>

          {isSistema && (
            <Button className="w-full" onClick={() => handleGenerate("pacote_completo")} disabled={generating !== null}>
              {generating === "pacote_completo" ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <FileText className="mr-2 size-4" />
              )}
              Gerar documentação completa
            </Button>
          )}
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{isSistema ? "Documentos individuais" : "Contrato"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {individualDocs.map((type) => {
                const doc = documents?.find((d) => d.document_type === type);
                const latest = doc?.versions[0];
                return (
                  <div
                    key={type}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{DOCUMENT_TYPE_LABEL[type]}</p>
                      <p className="text-xs text-muted-foreground">
                        {latest ? `Versão ${latest.version_number} · ${formatDateBR(latest.generated_at.slice(0, 10))}` : "Ainda não gerado"}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {latest && (
                        <Button size="sm" variant="outline" onClick={() => handleDownload(latest.storage_path)}>
                          <Download className="size-3.5" />
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" onClick={() => handleGenerate(type)} disabled={generating !== null}>
                        {generating === type ? <Loader2 className="size-3.5 animate-spin" /> : latest ? "Regenerar" : "Gerar"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Histórico de versões</CardTitle>
            </CardHeader>
            <CardContent>
              {!documents || documents.every((d) => d.versions.length === 0) ? (
                <p className="text-sm text-muted-foreground">Nenhum documento gerado ainda.</p>
              ) : (
                <div className="space-y-1">
                  {documents
                    .flatMap((doc) => doc.versions.map((v) => ({ ...v, document_type: doc.document_type })))
                    .sort((a, b) => (a.generated_at < b.generated_at ? 1 : -1))
                    .map((version) => (
                      <div
                        key={version.id}
                        className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0"
                      >
                        <span className="text-foreground">
                          {DOCUMENT_TYPE_LABEL[version.document_type]}{" "}
                          <span className="text-muted-foreground">v{version.version_number}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDateBR(version.generated_at.slice(0, 10))}</span>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}
