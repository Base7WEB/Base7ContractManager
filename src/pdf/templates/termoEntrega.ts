import type { DocumentContext } from "../context";
import { contentPage, docFooter, docHeader, metaTable, sectionTitle, sigGrid } from "../layout";
import { escapeHtml } from "../format";

export function termoEntregaTemplate(ctx: DocumentContext, current: number, total: number): string {
  const { client, product, contract, care } = ctx;

  return contentPage(`
    ${docHeader("02. Termo de Entrega e Aceite", "Base7 Web • Formalização de Entrega")}
    ${sectionTitle("02. Termo de Entrega e Aceite")}
    ${metaTable([
      [
        { label: "Cliente", value: escapeHtml(client.legal_name) },
        { label: "Sistema", value: escapeHtml(contract.system_name) },
      ],
      [
        { label: "Versão", value: escapeHtml(contract.system_version) },
        { label: "Data", value: ctx.generated_at_formatted },
      ],
    ])}

    <div class="sec-block">
      <h3>1. Itens Entregues</h3>
      <ul>
        <li>Sistema publicado e operacional.</li>
        <li>Painel administrativo e acessos previstos.</li>
        <li>Funcionalidades contratadas.</li>
        <li>Integrações contratadas (${product.scope.integrations.map(escapeHtml).join(", ")}).</li>
        <li>Manual de uso.</li>
        <li>Documentação técnica.</li>
        <li>Acessos e informações de infraestrutura, conforme modelo contratado.</li>
        <li>${care ? "Backup inicial (BASE7 CARE ativo)." : "Backup inicial — não aplicável (BASE7 CARE não contratado)."}</li>
        <li>Código-fonte — ${product.license.source_code_included ? "<b>incluído</b> nesta entrega." : "<b>não contratado</b> nesta licença."}</li>
      </ul>

      <h3>2. Pendências</h3>
    </div>
    ${metaTable([
      [{ label: "Pendências", value: "Nenhuma" }],
      [{ label: "Prazo", value: "—" }],
      [{ label: "Observações", value: "Sistema homologado sem ressalvas pela CONTRATANTE." }],
    ])}

    <div class="sec-block">
      <h3>3. Aceite</h3>
      <p>O CONTRATANTE declara ter tido oportunidade de validar a versão ${escapeHtml(contract.system_version)} e reconhece o recebimento da entrega, ressalvadas as pendências expressamente registradas.</p>
    </div>

    ${sigGrid([
      {
        label: "Cliente",
        name: client.contact_name,
        role: `${escapeHtml(client.legal_name)} · ${ctx.generated_at_formatted}`,
      },
      {
        label: "Base7 Web",
        name: ctx.company.name,
        role: `Representante · ${ctx.generated_at_formatted}`,
      },
    ])}

    ${docFooter(`Página ${current} de ${total}`)}
  `);
}
