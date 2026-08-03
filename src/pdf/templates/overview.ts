import type { DocumentContext } from "../context.js";
import { callout, contentPage, docFooter, docHeader, docTable, sectionTitle } from "../layout.js";
import { escapeHtml } from "../format.js";

export function overviewTemplate(ctx: DocumentContext, current: number, total: number): string {
  return contentPage(`
    ${docHeader("Kit de Documentação e Entrega", "Base7 Web • Visão Geral do Pacote")}
    ${sectionTitle("Estrutura do Pacote")}
    <p style="font-size:9.5pt;color:#333A47;margin:0 0 4mm;">A Base7 Web mantém estes seis documentos como modelos oficiais e gerou, para ${escapeHtml(ctx.client.trade_name)}, a versão personalizada abaixo:</p>

    ${docTable(
      ["Item", "Documento", "Objetivo Principal"],
      [
        ["<b>01</b>", "<b>Contrato de Desenvolvimento + Licença de Uso</b>", "Formalização legal, escopo e concessão de licença de uso do software."],
        ["<b>02</b>", "<b>Termo de Entrega e Aceite</b>", "Validação formal de homologação, entrega de funcionalidades e pendências."],
        ["<b>03</b>", "<b>Manual de Uso do Sistema</b>", "Guia operacional e orientações de uso para administradores e usuários."],
        ["<b>04</b>", "<b>Documentação Técnica</b>", "Especificação de stack, arquitetura, variáveis de ambiente e deploy."],
        ["<b>05</b>", "<b>Acessos e Infraestrutura</b>", "Matriz de responsabilidades e governança de contas e hospedagem."],
        ["<b>06</b>", "<b>Política de Backup e Continuidade</b>", "Rotinas de retenção, cópia de segurança e procedimentos de restauração."],
      ],
      ["9%", "38%"],
    )}

    ${sectionTitle("Princípios do Modelo")}
    ${callout("info", null, "Estes princípios norteiam a relação comercial e operacional entre a Base7 Web e seus clientes.")}
    <ul style="font-size:9.5pt;color:#333A47;padding-left:4mm;">
      <li style="margin-bottom:1.8mm;"><b>Licença de Uso:</b> o cliente recebe uma licença de uso do sistema contratado.</li>
      <li style="margin-bottom:1.8mm;"><b>Propriedade Intelectual:</b> a licença não equivale à transferência de propriedade do software.</li>
      <li style="margin-bottom:1.8mm;"><b>Código-Fonte:</b> código-fonte somente é entregue se isso estiver expressamente contratado.</li>
      <li style="margin-bottom:1.8mm;"><b>BASE7 CARE:</b> serviço opcional de infraestrutura, manutenção e suporte, salvo contratação expressa.</li>
      <li style="margin-bottom:1.8mm;"><b>Segurança:</b> senhas, tokens e secrets não devem constar em PDFs, TXT ou repositórios.</li>
    </ul>

    ${docFooter(`Página ${current} de ${total}`)}
  `);
}
