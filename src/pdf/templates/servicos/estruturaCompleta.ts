import type { ServiceDocumentContext } from "../../context.js";
import { escapeHtml } from "../../format.js";
import { renderServiceContractBody } from "./_shared.js";

export function contratoEstruturaCompletaTemplate(ctx: ServiceDocumentContext, current: number, total: number): string {
  const { client } = ctx;
  return renderServiceContractBody({
    ctx,
    current,
    total,
    documentTitle: "Contrato de Prestação de Serviço — Estrutura Completa",
    objectParagraph: `O presente contrato tem por objeto a prestação do serviço <b>Estrutura Completa</b>: desenvolvimento de site institucional, landing page, funil de vendas, automações e integrações, painel administrativo e 30 dias de gestão de tráfego pago para o lançamento, destinado à operação da CONTRATANTE sob o nome comercial "${escapeHtml(client.trade_name)}". O investimento em mídia paga (verba de anúncios) é de responsabilidade exclusiva da CONTRATANTE e não está incluído no valor deste contrato.`,
  });
}
