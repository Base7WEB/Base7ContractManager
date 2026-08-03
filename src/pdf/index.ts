import type { DocumentContext } from "./context";
import type { DocumentType } from "../types/domain";
import { htmlDocument } from "./layout";
import { coverTemplate } from "./templates/cover";
import { overviewTemplate } from "./templates/overview";
import { contratoTemplate } from "./templates/contrato";
import { termoEntregaTemplate } from "./templates/termoEntrega";
import { manualTemplate } from "./templates/manual";
import { docTecnicaTemplate } from "./templates/docTecnica";
import { acessosTemplate } from "./templates/acessos";
import { backupTemplate } from "./templates/backup";
import { checklistTemplate } from "./templates/checklist";

export { buildDocumentContext, type DocumentContext } from "./context";

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
export function renderSingleDocumentHtml(type: Exclude<DocumentType, "pacote_completo">, ctx: DocumentContext): string {
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

export function renderDocumentHtml(type: DocumentType, ctx: DocumentContext): string {
  if (type === "pacote_completo") return renderPackageHtml(ctx);
  return renderSingleDocumentHtml(type, ctx);
}
