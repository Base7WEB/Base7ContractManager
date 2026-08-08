import type { ServiceDocumentContext } from "../../context.js";
import { escapeHtml } from "../../format.js";
import { renderServiceContractBody } from "./_shared.js";

export function contratoLandingPageExpressTemplate(ctx: ServiceDocumentContext, current: number, total: number): string {
  const { client } = ctx;
  return renderServiceContractBody({
    ctx,
    current,
    total,
    documentTitle: "Contrato de Prestação de Serviço — Landing Page Express",
    objectParagraph: `O presente contrato tem por objeto a prestação do serviço <b>Landing Page Express</b>: desenvolvimento e entrega de uma landing page profissional, com copy otimizada para conversão e integração com WhatsApp ou formulário, destinada a campanhas e validação rápida da CONTRATANTE sob o nome comercial "${escapeHtml(client.trade_name)}".`,
  });
}
