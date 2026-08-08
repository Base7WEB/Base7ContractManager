import type { ServiceDocumentContext } from "../../context.js";
import { escapeHtml } from "../../format.js";
import { renderServiceContractBody } from "./_shared.js";

export function contratoGestaoTrafegoTemplate(ctx: ServiceDocumentContext, current: number, total: number): string {
  const { client } = ctx;
  return renderServiceContractBody({
    ctx,
    current,
    total,
    documentTitle: "Contrato de Prestação de Serviço — Gestão de Tráfego e Escala",
    objectParagraph: `O presente contrato tem por objeto a prestação contínua e mensal do serviço <b>Gestão de Tráfego e Escala</b>: gestão, otimização e escala progressiva de campanhas de tráfego pago da CONTRATANTE ("${escapeHtml(client.trade_name)}"), com relatórios mensais de performance e reuniões estratégicas periódicas. O investimento em mídia paga (verba de anúncios) é de responsabilidade exclusiva da CONTRATANTE e não está incluído na mensalidade deste contrato. Trata-se de contratação recorrente, renovada mês a mês nos termos da cláusula 3.`,
  });
}
