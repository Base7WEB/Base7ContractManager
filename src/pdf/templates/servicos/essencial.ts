import type { ServiceDocumentContext } from "../../context.js";
import { escapeHtml } from "../../format.js";
import { renderServiceContractBody } from "./_shared.js";

export function contratoEssencialTemplate(ctx: ServiceDocumentContext, current: number, total: number): string {
  const { client } = ctx;
  return renderServiceContractBody({
    ctx,
    current,
    total,
    documentTitle: "Contrato de Prestação de Serviço — Essencial",
    objectParagraph: `O presente contrato tem por objeto a prestação do serviço <b>Essencial</b>: desenvolvimento e entrega de site institucional de até 5 páginas, com design responsivo e SEO básico, destinado à operação da CONTRATANTE sob o nome comercial "${escapeHtml(client.trade_name)}".`,
  });
}
