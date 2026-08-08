import type { DocumentContext, ServiceDocumentContext } from "./context.js";
import type { DocumentType } from "../types/domain.js";
import { htmlDocument } from "./layout.js";
import { coverTemplate } from "./templates/cover.js";
import { overviewTemplate } from "./templates/overview.js";
import { contratoTemplate } from "./templates/contrato.js";
import { termoEntregaTemplate } from "./templates/termoEntrega.js";
import { manualTemplate } from "./templates/manual.js";
import { docTecnicaTemplate } from "./templates/docTecnica.js";
import { acessosTemplate } from "./templates/acessos.js";
import { backupTemplate } from "./templates/backup.js";
import { checklistTemplate } from "./templates/checklist.js";
import { SERVICE_CONTRACT_TEMPLATES } from "./templates/servicos/index.js";
import { renderServiceContractBody } from "./templates/servicos/_shared.js";
import { coverServicoTemplate } from "./templates/servicos/capa.js";

export { buildDocumentContext, buildServiceDocumentContext, type DocumentContext, type ServiceDocumentContext } from "./context.js";

/** DocumentType usado pelo mundo "sistema" (pacote de até 10 páginas) — "contrato_servico" é
 * tratado exclusivamente por renderServiceContractHtml, nunca por este pipeline. */
type SistemaDocumentType = Exclude<DocumentType, "contrato_servico">;

/**
 * Pacote de documentação completo: capa + visão geral + os 6 documentos + checklist,
 * reproduzindo a mesma estrutura de 10 páginas do modelo oficial da Base7 Web.
 */
export function renderPackageHtml(ctx: DocumentContext): string {
  const total = 10;
  const pages = [
    coverTemplate(ctx),
    overviewTemplate(ctx, 2, total),
    contratoTemplate(ctx, 3, total), // ocupa páginas 3 e 4
    termoEntregaTemplate(ctx, 5, total),
    manualTemplate(ctx, 6, total),
    docTecnicaTemplate(ctx, 7, total),
    acessosTemplate(ctx, 8, total),
    backupTemplate(ctx, 9, total),
    checklistTemplate(ctx),
  ].join("\n");

  return htmlDocument(pages, `BASE7 Web — Documentação — ${ctx.client.trade_name}`);
}

/** Gera um documento individual (numeração de página local, não a do pacote completo). */
export function renderSingleDocumentHtml(type: Exclude<SistemaDocumentType, "pacote_completo">, ctx: DocumentContext): string {
  let pages: string;
  let title: string;

  switch (type) {
    case "contrato":
      pages = contratoTemplate(ctx, 1, 2);
      title = "Contrato de Desenvolvimento + Licença";
      break;
    case "termo_entrega":
      pages = termoEntregaTemplate(ctx, 1, 1);
      title = "Termo de Entrega e Aceite";
      break;
    case "manual":
      pages = manualTemplate(ctx, 1, 1);
      title = "Manual de Uso do Sistema";
      break;
    case "doc_tecnica":
      pages = docTecnicaTemplate(ctx, 1, 1);
      title = "Documentação Técnica";
      break;
    case "acessos":
      pages = acessosTemplate(ctx, 1, 1);
      title = "Acessos e Infraestrutura";
      break;
    case "backup":
      pages = backupTemplate(ctx, 1, 1);
      title = "Política de Backup e Continuidade";
      break;
    case "checklist":
      pages = checklistTemplate(ctx);
      title = "Checklist de Fechamento";
      break;
    default: {
      const exhaustiveCheck: never = type;
      throw new Error(`Tipo de documento desconhecido: ${exhaustiveCheck}`);
    }
  }

  return htmlDocument(pages, `BASE7 Web — ${title} — ${ctx.client.trade_name}`);
}

export function renderDocumentHtml(type: SistemaDocumentType, ctx: DocumentContext): string {
  if (type === "pacote_completo") return renderPackageHtml(ctx);
  return renderSingleDocumentHtml(type, ctx);
}

/**
 * Contrato de serviço (contract_kind = "servico"): capa + 2 páginas de conteúdo (não o pacote de
 * 10 páginas — decisão do usuário). A capa segue o mesmo layout/CSS da capa dos contratos de
 * Sistema, só com os dados do serviço. Despacha pelo slug do serviço para um dos 9 templates
 * individuais; um slug fora do catálogo atual (serviço cadastrado manualmente sem template
 * dedicado) cai num corpo genérico que usa os mesmos dados do snapshot, para nunca travar a
 * geração do PDF.
 */
export function renderServiceContractHtml(ctx: ServiceDocumentContext, serviceSlug: string): string {
  const template = SERVICE_CONTRACT_TEMPLATES[serviceSlug];
  const body = template
    ? template(ctx, 2, 3)
    : renderServiceContractBody({
        ctx,
        current: 2,
        total: 3,
        documentTitle: `Contrato de Prestação de Serviço — ${ctx.service.name}`,
        objectParagraph: ctx.service.scope.object_text || `Prestação do serviço ${ctx.service.name} para ${ctx.client.trade_name}.`,
      });
  const html = coverServicoTemplate(ctx) + body;
  return htmlDocument(html, `BASE7 Web — Contrato de Prestação de Serviço — ${ctx.client.trade_name}`);
}
