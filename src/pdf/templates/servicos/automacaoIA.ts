import type { ServiceDocumentContext } from "../../context.js";
import { escapeHtml } from "../../format.js";
import { renderServiceContractBody } from "./_shared.js";

export function contratoAutomacaoIATemplate(ctx: ServiceDocumentContext, current: number, total: number): string {
  const { client } = ctx;
  return renderServiceContractBody({
    ctx,
    current,
    total,
    documentTitle: "Contrato de Prestação de Serviço — Automação de Atendimento com IA",
    objectParagraph: `O presente contrato tem por objeto a prestação do serviço <b>Automação de Atendimento com IA</b>: implantação de chatbot com inteligência artificial treinado para o negócio da CONTRATANTE ("${escapeHtml(client.trade_name)}"), com atendimento automatizado via WhatsApp, Instagram e site, qualificação de leads e integração com CRM. Custos de APIs e provedores de terceiros necessários ao funcionamento (ex.: WhatsApp Business API, provedor de inteligência artificial) correm por conta da CONTRATANTE e não estão incluídos no valor deste contrato.`,
  });
}
