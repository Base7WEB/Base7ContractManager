import type { DocumentContext } from "../context";
import { contentPage, docFooter, docHeader, metaTable, sectionTitle, sigGrid } from "../layout";
import { escapeHtml } from "../format";

export function contratoTemplate(ctx: DocumentContext, current: number, total: number): string {
  const { client, product, contract, care, company } = ctx;
  const pageA = contentPage(`
    ${docHeader("01. Contrato de Desenvolvimento + Licença", "Base7 Web • Modelo de Documentação")}
    ${sectionTitle("01. Contrato de Desenvolvimento + Licença de Uso")}
    ${metaTable([
      [
        { label: "Contrato Nº", value: escapeHtml(contract.number) },
        { label: "Sistema", value: escapeHtml(contract.system_name) },
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
        { label: "Valor", value: `${escapeHtml(contract.value_formatted)} — ${escapeHtml(contract.payment_method)}` },
        { label: "Prazo", value: `${contract.term_days} dias corridos` },
      ],
    ])}

    <div class="sec-block">
      <h3>1. Objeto</h3>
      <p>O presente contrato tem por objeto o desenvolvimento, configuração, implantação e/ou personalização do sistema <b>${escapeHtml(product.name)}</b>, conforme escopo e funcionalidades descritos neste instrumento e seus anexos, destinado à operação da CONTRATANTE sob o nome comercial "${escapeHtml(client.trade_name)}".</p>

      <h3>2. Escopo</h3>
      <ul>
        <li><b>Módulos e funcionalidades:</b> ${product.scope.modules.map(escapeHtml).join("; ")}.</li>
        <li><b>Integrações:</b> ${product.scope.integrations.map(escapeHtml).join("; ")} — cada uma na conta própria da CONTRATANTE.</li>
        <li><b>Ambiente de produção:</b> ${escapeHtml(product.scope.infrastructure.frontend_hosting ?? "")}${product.scope.infrastructure.backend ? " + " + escapeHtml(product.scope.infrastructure.backend) : ""}, em projeto individual e isolado — <code class="pill">${escapeHtml(contract.subdomain)}</code>.</li>
        <li><b>Cronograma:</b> início em ${contract.start_date_formatted}, entrega em ${contract.delivery_date_formatted} (${contract.term_days} dias corridos).</li>
      </ul>

      <h3>3. Licença de Uso</h3>
      <p>A CONTRATADA concede ao CONTRATANTE uma licença de uso do sistema ${escapeHtml(product.name)}, <b>${escapeHtml(product.license.type)}, ${escapeHtml(product.license.transferability)} e por prazo ${escapeHtml(product.license.term)}</b>, destinada à utilização pelo CONTRATANTE em sua própria operação.</p>
      <p>${escapeHtml(product.license.ip_clause_text)}</p>

      <h3>4. Código-fonte</h3>
      <p>${
        product.license.source_code_included
          ? "O código-fonte está incluído nesta contratação, conforme condições, formato e versão definidos em instrumento específico anexo a este contrato."
          : "Na modalidade padrão desta contratação, o código-fonte <b>não integra</b> a licença de uso e permanece sob controle da CONTRATADA."
      }</p>

      <h3>5. Infraestrutura e BASE7 CARE</h3>
      <p>${
        care
          ? `Foi contratado o plano <b>BASE7 CARE</b> (${escapeHtml(care.monthly_price_formatted)}/mês, vencimento todo dia ${care.due_day}, início em ${care.start_date_formatted}), compreendendo hospedagem, banco de dados, backups, monitoramento básico, manutenção, atualizações e suporte técnico. Enquanto o BASE7 CARE estiver ativo, a responsabilidade pela infraestrutura listada é da CONTRATADA.`
          : "O BASE7 CARE não foi contratado nesta venda. A responsabilidade pela infraestrutura, hospedagem, backups e manutenção é da CONTRATANTE, salvo acordo posterior registrado em aditivo."
      }</p>
    </div>

    ${docFooter(`Página ${current} de ${total}`)}
  `);

  const pageB = contentPage(`
    ${docHeader("01. Contrato de Desenvolvimento + Licença", "Base7 Web • Cláusulas Finais e Assinaturas")}

    <div class="sec-block">
      <h3>6. Serviços de Terceiros</h3>
      <p>Domínio, ${product.scope.integrations.map(escapeHtml).join(", ")} e demais serviços de terceiros podem possuir custos e regras próprias. Tais custos não são automaticamente incluídos no valor da licença ou do BASE7 CARE, salvo previsão expressa.</p>

      <h3>7. Garantia e Suporte</h3>
      <p>A garantia técnica é de <b>${product.warranty.days} dias corridos</b> após a entrega (${contract.delivery_date_formatted} a ${contract.warranty_end_date_formatted}) e cobre ${product.warranty.covered.map((s: string) => escapeHtml(s).toLowerCase()).join(", ")}. Não estão cobertos: ${product.warranty.not_covered.map((s: string) => escapeHtml(s).toLowerCase()).join(", ")}. O suporte contínuo após a garantia segue o plano BASE7 CARE contratado, quando ativo.</p>

      <h3>8. Aceite</h3>
      <p>A entrega será formalizada mediante Termo de Entrega e Aceite (documento 02), registrando a versão disponibilizada (${escapeHtml(contract.system_version)}) e eventuais pendências acordadas.</p>

      <h3>9. LGPD e Confidencialidade</h3>
      <p>As partes deverão observar as obrigações aplicáveis de proteção de dados, segurança da informação e confidencialidade, conforme a natureza do projeto e a legislação vigente.</p>

      <h3>10. Rescisão e Encerramento</h3>
      <p>As condições de rescisão, encerramento da licença, exportação de dados, transferência de infraestrutura e encerramento do BASE7 CARE deverão ser definidas de forma específica no contrato ou em instrumento aditivo entre as partes.</p>
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

    ${docFooter(`Página ${current + 1} de ${total}`)}
  `);

  return pageA + pageB;
}
