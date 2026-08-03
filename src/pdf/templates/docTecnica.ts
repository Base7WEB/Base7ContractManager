import type { DocumentContext } from "../context";
import { contentPage, docFooter, docHeader, docTable, metaTable, sectionTitle } from "../layout";
import { escapeHtml } from "../format";

export function docTecnicaTemplate(ctx: DocumentContext, current: number, total: number): string {
  const { product, contract } = ctx;

  return contentPage(`
    ${docHeader("04. Documentação Técnica", "Base7 Web • Arquitetura & Stack")}
    ${sectionTitle("04. Documentação Técnica")}
    ${metaTable([
      [
        { label: "Projeto", value: escapeHtml(contract.system_name) },
        { label: "Versão", value: escapeHtml(contract.system_version) },
      ],
      [
        { label: "Repositório", value: "Individual, privado (Base7 Web)" },
        { label: "Ambiente", value: "Produção" },
      ],
    ])}

    <div class="sec-block">
      <h3>1. Stack</h3>
      <p>• <b>Frontend:</b> ${escapeHtml(product.tech_docs.frontend)}<br>
      • <b>Backend/Banco:</b> ${escapeHtml(product.tech_docs.backend)}<br>
      • <b>Hospedagem:</b> ${escapeHtml(product.tech_docs.hosting)} &nbsp; • <b>Serviços adicionais:</b> ${escapeHtml(product.tech_docs.additional_services)}</p>

      <h3>2. Arquitetura</h3>
      <p>${escapeHtml(product.tech_docs.architecture_text)}</p>

      <h3>3. Variáveis de Ambiente</h3>
      <p style="font-size:8.4pt;color:#8993A6;margin-bottom:2mm;">Utilizar <code class="pill">.env.example</code> com nomes das variáveis, sem valores reais.</p>
    </div>
    ${docTable(
      ["Variável", "Descrição / Observação"],
      [
        ['<code class="pill">DATABASE_URL</code>', "necessária"],
        ['<code class="pill">SUPABASE_URL</code>', "necessária"],
        ['<code class="pill">SUPABASE_ANON_KEY</code>', "conforme arquitetura"],
        ['<code class="pill">PAYMENT_GATEWAY_TOKEN</code>', "secret — não documentar valor"],
        ['<code class="pill">FISCAL_API_TOKEN</code>', "secret — não documentar valor, quando aplicável"],
      ],
      ["42%"],
    )}

    <div class="sec-block">
      <h3>4. Deploy</h3>
      <p>${escapeHtml(product.tech_docs.deploy_text)}</p>

      <h3>5. Banco de Dados</h3>
      <p>Migrações versionadas, aplicadas em ordem, com Row Level Security por tabela. Rotinas de backup conforme documento 06. Credenciais administrativas não constam nesta documentação.</p>

      <h3>6. Segurança</h3>
      <ul>
        ${product.tech_docs.security_bullets.map((b: string) => `<li>${escapeHtml(b)}.</li>`).join("")}
      </ul>
    </div>

    ${docFooter(`Página ${current} de ${total}`)}
  `);
}
