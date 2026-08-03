import type { DocumentContext } from "../context";
import { LOGO_DATA_URI, callout, checklist, contentPage, docHeader, sectionTitle } from "../layout";
import { escapeHtml } from "../format";

export function checklistTemplate(ctx: DocumentContext): string {
  const { client, care, product } = ctx;

  const items = [
    { label: "Contrato assinado", state: "done" as const },
    { label: "Escopo aprovado", state: "done" as const },
    { label: "Sistema homologado", state: "done" as const },
    { label: "Termo de entrega assinado", state: "done" as const },
    { label: "Manual entregue", state: "done" as const },
    { label: "Documentação técnica entregue", state: "done" as const },
    { label: "Acessos definidos", state: "done" as const },
    { label: care ? "Backup inicial realizado" : "Backup inicial — não aplicável (sem BASE7 CARE)", state: (care ? "done" : "na") as "done" | "na" },
    {
      label: product.license.source_code_included
        ? "Código-fonte entregue"
        : "Código-fonte entregue, se contratado — não contratado",
      state: (product.license.source_code_included ? "done" : "na") as "done" | "na",
    },
    { label: care ? "BASE7 CARE registrado (ativo)" : "BASE7 CARE — não contratado", state: (care ? "done" : "na") as "done" | "na" },
    { label: "Pendências registradas — nenhuma", state: "done" as const },
  ];

  return contentPage(`
    ${docHeader("Checklist & Encerramento", "Base7 Web • Modelo de Documentação")}
    ${sectionTitle(`Checklist de Fechamento — ${client.trade_name}`)}

    ${checklist(items)}

    ${callout(
      "warning",
      "⚖ Aviso Jurídico",
      "Este material segue o modelo comercial/operacional oficial da Base7 Web. A relação comercial é estruturada como licença de uso — salvo disposição expressa em instrumento específico, não há transferência de propriedade intelectual do software ao cliente. Em caso de dúvida sobre cláusulas, responsabilidades, LGPD ou encerramento do BASE7 CARE, consulte o setor jurídico da Base7 Web.",
    )}

    <div class="closing-footer">
      <img src="${LOGO_DATA_URI}" alt="${escapeHtml(ctx.company.name)}">
      <div class="tag">Sistemas • Sites • Automações • Tecnologia</div>
    </div>
  `);
}
