import type { DocumentContext } from "../context";
import { LOGO_DATA_URI } from "../layout";
import { escapeHtml } from "../format";

export function coverTemplate(ctx: DocumentContext): string {
  const { client, product, company } = ctx;

  return `<div class="page page-cover">
    <div class="cover-bg">
      <span class="cover-badge">Documentação &amp; Entrega</span>
      <div class="cover-title">Kit de Documentação e Entrega de Sistemas</div>
      <div class="cover-sub">Modelos profissionais para sistemas individualizados com licença de uso.</div>

      <div class="cover-logo-wrap"><img src="${LOGO_DATA_URI}" alt="${escapeHtml(company.name)}"></div>

      <table class="cover-meta">
        <tr><td class="k">Sistema</td><td class="v">${escapeHtml(product.name)}</td></tr>
        <tr><td class="k">Versão</td><td class="v">${escapeHtml(ctx.contract.system_version)}</td></tr>
        <tr><td class="k">Data</td><td class="v">${ctx.generated_at_formatted}</td></tr>
        <tr><td class="k">Modelo Comercial</td><td class="v">Licença de Uso</td></tr>
        <tr><td class="k">Cliente</td><td class="v">${escapeHtml(client.trade_name)} (${escapeHtml(client.legal_name)})</td></tr>
      </table>

      <div class="cover-warning">
        <div class="h">⚠ Aviso importante</div>
        Este documento formaliza a licença de uso do sistema contratado. A relação comercial é estruturada como licença de uso — não há transferência de propriedade intelectual do software ao cliente, salvo disposição expressa em instrumento específico.
      </div>
    </div>
  </div>`;
}
