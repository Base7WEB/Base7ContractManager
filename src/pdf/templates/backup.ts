import type { DocumentContext } from "../context.js";
import { contentPage, docFooter, docHeader, docTable, metaTable, sectionTitle } from "../layout.js";
import { escapeHtml } from "../format.js";

export function backupTemplate(ctx: DocumentContext, current: number, total: number): string {
  const { client, product, care } = ctx;
  const policy = product.backup_policy;

  return contentPage(`
    ${docHeader("06. Política de Backup e Continuidade", "Base7 Web • Planos & Retenção")}
    ${sectionTitle("06. Política de Backup e Continuidade")}
    ${metaTable([
      [
        { label: "Sistema", value: escapeHtml(product.name) },
        { label: "Cliente", value: escapeHtml(client.trade_name) },
      ],
      [
        { label: "BASE7 Care", value: care ? "Ativo" : "Inativo" },
        { label: "Versão", value: escapeHtml(ctx.contract.system_version) },
      ],
      [
        { label: "Data", value: ctx.generated_at_formatted },
        { label: "Escopo", value: "Banco &amp; Mídia" },
      ],
    ])}

    <div class="sec-block">
      <h3>1. Objetivo</h3>
      <p>Definir as rotinas de cópia, retenção, restauração e responsabilidades relacionadas aos dados e componentes do sistema.</p>

      <h3>2. Escopo</h3>
      <ul>
        <li><b>Frequência:</b> ${escapeHtml(policy.frequency)}.</li>
        <li><b>Retenção:</b> ${escapeHtml(policy.retention)}.</li>
        <li><b>Código-fonte:</b> versionado, sob controle da ${escapeHtml(ctx.company.name)}.</li>
      </ul>
    </div>

    ${docTable(
      ["Frequência", "Retenção", "Local", "Teste de Restauração"],
      [[escapeHtml(policy.frequency), escapeHtml(policy.retention), escapeHtml(policy.storage_location), escapeHtml(policy.restore_test_frequency)]],
    )}

    <div class="sec-block">
      <h3>4. Restauração</h3>
      <p>Em caso de incidente, a restauração é realizada conforme criticidade e disponibilidade dos backups, registrando ponto de restauração, data, causa e resultado.</p>
      <h3>5. Responsabilidades</h3>
      <p>${escapeHtml(policy.responsibilities_text)}</p>
      <h3>6. Limitações</h3>
      <p>Backup reduz risco, mas não elimina todas as possibilidades de perda ou indisponibilidade. O nível de proteção depende da frequência, retenção, armazenamento e testes definidos.</p>
    </div>

    ${docFooter(`Página ${current} de ${total}`)}
  `);
}
