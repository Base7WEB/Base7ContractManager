import type { ServiceDocumentContext } from "../../context.js";
import { contentPage, docFooter, docHeader, metaTable, sectionTitle, sigGrid } from "../../layout.js";
import { escapeHtml } from "../../format.js";

const FOOTER_LABEL = "Base7 Web — Contrato de Prestação de Serviço";

/**
 * Corpo comum aos 9 contratos de serviço (metadados, escopo, pagamento, prazo, garantia,
 * responsabilidades, disposições gerais e assinaturas) — cada arquivo em templates/servicos/
 * chama isto passando só o parágrafo de objeto e o título, que são específicos da oferta.
 * Contrato enxuto por decisão do usuário: sem cláusulas de licença de software, código-fonte
 * ou BASE7 CARE (que não se aplicam a serviços de preço fechado).
 *
 * Sempre 2 páginas fixas (não 1 "elástica"): o volume de cláusulas varia bastante entre
 * serviços (ex.: Estrutura Completa tem 8 entregáveis, Consultoria tem 4) e deixar numa página
 * só fazia o conteúdo mais longo transbordar pro início de uma 2ª página sem header/footer
 * próprios. Duas páginas fixas, cada uma com seu doc-header/doc-footer, sempre renderizam limpo.
 */
export function renderServiceContractBody(params: {
  ctx: ServiceDocumentContext;
  documentTitle: string;
  objectParagraph: string;
  current: number;
  total: number;
}): string {
  const { ctx, documentTitle, objectParagraph, current, total } = params;
  const { client, service, contract, company } = ctx;

  const paymentLine = service.payment_terms.recurring
    ? `${escapeHtml(contract.payment_method || service.payment_terms.default_method)}, no valor de ${escapeHtml(contract.value_formatted)}/mês.`
    : `${escapeHtml(contract.payment_method || service.payment_terms.default_method)}, no valor total de ${escapeHtml(contract.value_formatted)}.`;

  const renewalParagraph =
    service.payment_terms.recurring && service.payment_terms.renewal_text
      ? `<p>${escapeHtml(service.payment_terms.renewal_text)}</p>`
      : "";

  const warrantyParagraph =
    contract.warranty_end_date_formatted && service.warranty.days
      ? `<p>A garantia/suporte técnico é de <b>${service.warranty.days} dias corridos</b> após a entrega (${contract.delivery_date_formatted} a ${contract.warranty_end_date_formatted}). ${escapeHtml(service.warranty.notes)}</p>`
      : `<p>${escapeHtml(service.warranty.notes || "Este serviço não possui período de garantia técnica associado, por sua natureza pontual/consultiva.")}</p>`;

  const pageA = contentPage(`
    ${docHeader(documentTitle, "Base7 Web • Contrato de Prestação de Serviço")}
    ${sectionTitle(documentTitle)}
    ${metaTable([
      [
        { label: "Contrato Nº", value: escapeHtml(contract.number) },
        { label: "Serviço", value: escapeHtml(service.name) },
      ],
      [
        { label: "Contratante", value: escapeHtml(client.legal_name) },
        { label: "CNPJ/CPF", value: escapeHtml(client.document_formatted) },
      ],
      [
        { label: "Contratada", value: escapeHtml(company.name) },
        { label: "CNPJ", value: company.cnpj ? escapeHtml(company.cnpj) : "[a inserir em Configurações &gt; Empresa]" },
      ],
      [
        { label: "Valor", value: escapeHtml(contract.value_formatted) + (service.payment_terms.recurring ? "/mês" : "") },
        { label: "Início", value: contract.start_date_formatted },
      ],
    ])}

    <div class="sec-block">
      <h3>1. Objeto</h3>
      <p>${objectParagraph}</p>

      <h3>2. Escopo e Entregáveis</h3>
      <ul>
        ${service.scope.deliverables.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}
      </ul>
      ${
        service.scope.exclusions.length > 0
          ? `<p><b>Não estão inclusos neste contrato:</b> ${service.scope.exclusions.map((e) => escapeHtml(e).toLowerCase()).join("; ")}.</p>`
          : ""
      }

      <h3>3. Valor e Forma de Pagamento</h3>
      <p>${paymentLine}</p>
      ${renewalParagraph}
    </div>

    ${docFooter(`Página ${current} de ${total}`, FOOTER_LABEL)}
  `);

  const pageB = contentPage(`
    ${docHeader(documentTitle, "Base7 Web • Cláusulas Finais e Assinaturas")}

    <div class="sec-block">
      <h3>4. Prazo de Entrega</h3>
      <p>${escapeHtml(service.delivery_text)}. Início em ${contract.start_date_formatted}, entrega prevista em ${contract.delivery_date_formatted}, ressalvados atrasos causados pelo CONTRATANTE (aprovações, fornecimento de material ou acessos).</p>

      <h3>5. Garantia e Suporte</h3>
      ${warrantyParagraph}

      <h3>6. Responsabilidades do Contratante</h3>
      <ul>
        ${service.scope.client_responsibilities.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}
      </ul>

      <h3>7. LGPD, Confidencialidade e Disposições Gerais</h3>
      <p>As partes deverão observar as obrigações aplicáveis de proteção de dados, segurança da informação e confidencialidade, conforme a natureza do projeto e a legislação vigente. Este contrato não constitui licença de uso de software nem cessão de código-fonte — trata-se de prestação de serviço de preço fechado, conforme escopo acima. Condições de rescisão e eventuais aditivos deverão ser formalizados por escrito entre as partes.</p>
    </div>

    ${sectionTitle("Assinaturas", true)}
    ${sigGrid([
      {
        label: "Contratante",
        name: client.contact_name,
        role: `${client.contact_role ?? "Representante"} — ${escapeHtml(client.legal_name)} · ${ctx.generated_at_formatted}`,
      },
      {
        label: "Contratada (Base7 Web)",
        name: company.name,
        role: `Representante legal · ${ctx.generated_at_formatted}`,
      },
    ])}

    ${docFooter(`Página ${current + 1} de ${total}`, FOOTER_LABEL)}
  `);

  return pageA + pageB;
}
