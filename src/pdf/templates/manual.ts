import type { DocumentContext } from "../context";
import { callout, contentPage, docFooter, docHeader, metaTable, sectionTitle } from "../layout";
import { escapeHtml } from "../format";

export function manualTemplate(ctx: DocumentContext, current: number, total: number): string {
  const { client, product, contract, care } = ctx;

  return contentPage(`
    ${docHeader("03. Manual de Uso do Sistema", "Base7 Web • Guia de Operação")}
    ${sectionTitle("03. Manual de Uso do Sistema")}
    ${metaTable([
      [
        { label: "Sistema", value: escapeHtml(product.name) },
        { label: "Versão", value: escapeHtml(contract.system_version) },
      ],
      [
        { label: "Cliente", value: escapeHtml(client.trade_name) },
        { label: "URL", value: escapeHtml(contract.subdomain) },
      ],
      [
        { label: "Atualização", value: ctx.generated_at_formatted },
        { label: "Acesso", value: "Restrito / Autenticado" },
      ],
    ])}

    <div class="sec-block">
      <h3>1. Acesso</h3>
      <p>Acesse <code class="pill">https://${escapeHtml(contract.subdomain)}/admin</code>, informe suas credenciais e altere a senha temporária no primeiro acesso.</p>

      <h3>2. Dashboard</h3>
      <p>O dashboard apresenta os principais indicadores e atalhos operacionais do ${escapeHtml(product.name)}.</p>

      <h3>3. Operações Principais</h3>
      <ul>
        ${product.scope.modules.map((m: string) => `<li>${escapeHtml(m)}</li>`).join("")}
      </ul>

      <h3>4. Configurações</h3>
      <p>Edição de conteúdo institucional e das credenciais próprias de ${product.scope.integrations.map(escapeHtml).join(", ")}, coladas diretamente no painel — nenhuma credencial sensível fica armazenada no frontend.</p>

      <h3>5. Boas Práticas</h3>
      <ul>
        <li>Não compartilhar credenciais.</li>
        <li>Utilizar senhas individuais e fortes.</li>
        <li>Não publicar tokens ou chaves.</li>
        <li>Ao reportar um problema, informar horário, usuário e ação realizada.</li>
      </ul>

      <h3>6. Suporte</h3>
      ${callout(
        "info",
        null,
        care
          ? `<b>Canal:</b> conforme cadastro em Base7 Web &nbsp;|&nbsp; <b>Escopo:</b> conforme BASE7 CARE (${escapeHtml(care.monthly_price_formatted)}/mês)`
          : `<b>Escopo:</b> suporte conforme período de garantia contratual (${product.warranty.days} dias após a entrega) — sem BASE7 CARE ativo, não há suporte contínuo previsto.`,
      )}
    </div>

    ${docFooter(`Página ${current} de ${total}`)}
  `);
}
