import type { DocumentContext } from "../context.js";
import { callout, contentPage, docFooter, docHeader, docTable, metaTable, sectionTitle } from "../layout.js";
import { escapeHtml } from "../format.js";

export function acessosTemplate(ctx: DocumentContext, current: number, total: number): string {
  const { client, product, contract, care, company } = ctx;

  return contentPage(`
    ${docHeader("05. Acessos e Infraestrutura", "Base7 Web • Governança & Matriz")}
    ${sectionTitle("05. Acessos e Infraestrutura")}

    ${callout(
      "security",
      "⚠ Atenção de Segurança",
      "Não registrar senhas, tokens, chaves privadas ou secrets neste documento. Registre apenas responsabilidade, localização e procedimento seguro de acesso.",
    )}

    ${metaTable([
      [
        { label: "Cliente", value: escapeHtml(client.trade_name) },
        { label: "Sistema", value: escapeHtml(product.name) },
      ],
      [
        { label: "BASE7 Care", value: care ? '<span class="dot"></span> Ativo' : '<span class="dot outline"></span> Inativo' },
        { label: "Revisão", value: ctx.generated_at_formatted },
      ],
    ])}

    <div class="sec-block"><h3>Matriz de Responsabilidades</h3></div>
    ${docTable(
      ["Recurso", "Responsável", "Admin", "Observação"],
      [
        ["Repositório de código", escapeHtml(company.name), '<span class="dot"></span>', "Repositório individual"],
        [escapeHtml(product.tech_docs.hosting), escapeHtml(company.name), '<span class="dot"></span>', "Projeto individual"],
        [escapeHtml(product.tech_docs.backend), escapeHtml(company.name), '<span class="dot"></span>', "Projeto individual"],
        ["Domínio / DNS", escapeHtml(company.name), '<span class="dot"></span>', escapeHtml(contract.subdomain)],
        ["Pagamentos", escapeHtml(client.trade_name), '<span class="dot outline"></span>', "Conta própria da contratante"],
        ["APIs externas", `${escapeHtml(client.trade_name)} / ${escapeHtml(company.name)}`, '<span class="dot outline"></span>', "Conforme contrato"],
      ],
      ["24%", "22%", "14%"],
    )}

    <div class="sec-block">
      <h3>Entrega Segura</h3>
      <ul>
        <li>Senhas temporárias devem ser alteradas no primeiro acesso.</li>
        <li>Secrets devem permanecer em gerenciador de segredos ou variáveis de ambiente.</li>
        <li>Este documento indica apenas onde e por quem o acesso é administrado.</li>
      </ul>
      <h3>Encerramento do BASE7 CARE</h3>
      <p>${
        care
          ? "Quando o CARE for encerrado, a transferência de infraestrutura, dados, backups e acessos segue o procedimento definido no contrato, incluindo prazos e limites de responsabilidade."
          : "Não aplicável nesta contratação — BASE7 CARE não está ativo."
      }</p>
    </div>

    ${docFooter(`Página ${current} de ${total}`)}
  `);
}
