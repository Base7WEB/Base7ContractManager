import type { ServiceDocumentContext } from "../../context.js";
import { escapeHtml } from "../../format.js";
import { renderServiceContractBody } from "./_shared.js";

export function contratoSprintValidacaoTemplate(ctx: ServiceDocumentContext, current: number, total: number): string {
  const { client } = ctx;
  return renderServiceContractBody({
    ctx,
    current,
    total,
    documentTitle: "Contrato de Prestação de Serviço — Sprint de Validação (15 dias)",
    objectParagraph: `O presente contrato tem por objeto a prestação do serviço <b>Sprint de Validação</b>: execução de um ciclo de 15 dias de testes controlados de tráfego pago, para validar público, criativos e oferta da CONTRATANTE ("${escapeHtml(client.trade_name)}") antes de decisões de escala. O investimento em mídia paga (verba de anúncios) é de responsabilidade exclusiva da CONTRATANTE e não está incluído no valor deste contrato. Por se tratar de um diagnóstico controlado, os resultados dependem de fatores de mercado e verba disponível, não constituindo promessa de resultado.`,
  });
}
