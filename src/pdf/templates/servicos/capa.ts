import type { ServiceDocumentContext } from "../../context.js";
import { LOGO_DATA_URI } from "../../layout.js";
import { escapeHtml } from "../../format.js";
import { SERVICE_CATEGORY_LABEL } from "../../../types/domain.js";

/** Capa padrão dos contratos de serviço — mesmo layout/CSS (.page-cover, .cover-*) da capa dos
 * contratos de Sistema (templates/cover.ts), só com os dados trocados para o mundo de serviço. */
export function coverServicoTemplate(ctx: ServiceDocumentContext): string {
  const { client, service, company } = ctx;

  return `<div class="page page-cover">
    <div class="cover-bg">
      <span class="cover-badge">Prestação de Serviço</span>
      <div class="cover-title">Contrato de Prestação de Serviço</div>
      <div class="cover-sub">${escapeHtml(service.tagline)}</div>

      <div class="cover-logo-wrap"><img src="${LOGO_DATA_URI}" alt="${escapeHtml(company.name)}"></div>

      <table class="cover-meta">
        <tr><td class="k">Serviço</td><td class="v">${escapeHtml(service.name)}</td></tr>
        <tr><td class="k">Categoria</td><td class="v">${escapeHtml(SERVICE_CATEGORY_LABEL[service.category])}</td></tr>
        <tr><td class="k">Data</td><td class="v">${ctx.generated_at_formatted}</td></tr>
        <tr><td class="k">Modelo Comercial</td><td class="v">Prestação de Serviço — Preço Fechado</td></tr>
        <tr><td class="k">Cliente</td><td class="v">${escapeHtml(client.trade_name)} (${escapeHtml(client.legal_name)})</td></tr>
      </table>

      <div class="cover-warning">
        <div class="h">⚠ Aviso importante</div>
        Este documento formaliza a prestação do serviço contratado, de preço fechado. Não se trata de licença de uso de software nem de cessão de código-fonte — o escopo, o valor e as condições de pagamento, prazo e garantia estão detalhados nas páginas seguintes.
      </div>
    </div>
  </div>`;
}
