import type { ServiceDocumentContext } from "../../context.js";
import { escapeHtml } from "../../format.js";
import { renderServiceContractBody } from "./_shared.js";

export function contratoDashboardMetricasTemplate(ctx: ServiceDocumentContext, current: number, total: number): string {
  const { client } = ctx;
  return renderServiceContractBody({
    ctx,
    current,
    total,
    documentTitle: "Contrato de Prestação de Serviço — Dashboard de Métricas em Tempo Real",
    objectParagraph: `O presente contrato tem por objeto a prestação do serviço <b>Dashboard de Métricas em Tempo Real</b>: desenvolvimento de painel de indicadores personalizado para a CONTRATANTE ("${escapeHtml(client.trade_name)}"), integrado às fontes de dados definidas no escopo aprovado (ex.: Meta Ads, Google Ads, Analytics), com atualização em tempo real e acesso por computador e celular. Eventuais custos de licenciamento de ferramentas de terceiros necessários à integração correm por conta da CONTRATANTE.`,
  });
}
