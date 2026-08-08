import type { ServiceDocumentContext } from "../../context.js";
import { escapeHtml } from "../../format.js";
import { renderServiceContractBody } from "./_shared.js";

export function contratoConsultoriaEstrategicaTemplate(ctx: ServiceDocumentContext, current: number, total: number): string {
  const { client } = ctx;
  return renderServiceContractBody({
    ctx,
    current,
    total,
    documentTitle: "Contrato de Prestação de Serviço — Consultoria Estratégica",
    objectParagraph: `O presente contrato tem por objeto a prestação do serviço <b>Consultoria Estratégica</b>: reunião estratégica de 1 hora, análise do negócio e entrega de plano de ação personalizado e direcionamento de marketing para a CONTRATANTE ("${escapeHtml(client.trade_name)}"). A execução das ações recomendadas não está incluída neste contrato, sendo objeto de contratação à parte, se de interesse da CONTRATANTE.`,
  });
}
