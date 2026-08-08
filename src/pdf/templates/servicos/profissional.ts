import type { ServiceDocumentContext } from "../../context.js";
import { escapeHtml } from "../../format.js";
import { renderServiceContractBody } from "./_shared.js";

export function contratoProfissionalTemplate(ctx: ServiceDocumentContext, current: number, total: number): string {
  const { client } = ctx;
  return renderServiceContractBody({
    ctx,
    current,
    total,
    documentTitle: "Contrato de Prestação de Serviço — Profissional",
    objectParagraph: `O presente contrato tem por objeto a prestação do serviço <b>Profissional</b>: desenvolvimento e entrega de site (até 10 páginas) ou landing page, com design premium customizado, estrutura de SEO e copy estratégica, destinado à operação da CONTRATANTE sob o nome comercial "${escapeHtml(client.trade_name)}".`,
  });
}
