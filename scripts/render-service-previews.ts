/* Renderiza os 9 contratos de serviço localmente, com dados fictícios (mesmo padrão de
 * render-preview.ts), sem depender de Supabase nem do endpoint serverless — útil para revisar
 * visualmente os 9 templates de uma vez.
 * Rodar: npx tsx scripts/render-service-previews.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderServiceContractHtml, type ServiceDocumentContext } from "../src/pdf";
import { htmlToPdfBuffer } from "../src/pdf/render-node";
import { formatCurrencyBRL, formatDateBR, addDaysISO } from "../src/pdf/format";
import { services } from "./data/serviceCatalog";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const company: ServiceDocumentContext["company"] = {
  name: "Base7 Web",
  legal_name: null,
  cnpj: null,
  email: "contato@base7web.com.br",
  phone: null,
  address_street: null,
  address_number: null,
  address_complement: null,
  address_neighborhood: null,
  address_city: "São José dos Campos",
  address_state: "SP",
  address_zip: null,
  logo_url: "/imagem/logo-base7web.png",
};

const client: ServiceDocumentContext["client"] = {
  trade_name: "Barbearia Dom Corte",
  legal_name: "Dom Corte Barbearia e Estética Masculina LTDA",
  kind: "CNPJ",
  document_formatted: "12.345.678/0001-90",
  address_formatted: "Avenida Brasil, 1250, Jardim América, São José dos Campos — SP, CEP 12240-000",
  contact_name: "Rafael Henrique Almeida",
  contact_role: "Sócio Administrador",
  email: "contato@domcortebarber.com.br",
  phone: "(12) 99999-0000",
};

async function main() {
  const outDir = path.resolve(__dirname, "output", "servicos");
  fs.mkdirSync(outDir, { recursive: true });

  const startDate = "2026-08-25";

  for (const service of services) {
    const termDays = service.payment_terms.term_days ?? 15;
    const deliveryDate = addDaysISO(startDate, termDays);

    const ctx: ServiceDocumentContext = {
      company,
      service: {
        slug: service.slug,
        name: service.name,
        badge: service.badge,
        tagline: service.tagline,
        category: service.category,
        price: service.price,
        price_prefix: service.price_prefix,
        price_period: service.price_period,
        delivery_text: service.delivery_text,
        items: service.items,
        scope: service.scope,
        payment_terms: service.payment_terms,
        warranty: service.warranty,
      },
      client,
      contract: {
        number: "0001/2026",
        status: "gerado",
        value_formatted: formatCurrencyBRL(service.price),
        payment_method: service.payment_terms.default_method,
        start_date_formatted: formatDateBR(startDate),
        delivery_date_formatted: formatDateBR(deliveryDate),
        warranty_end_date_formatted: service.warranty.days ? formatDateBR(addDaysISO(deliveryDate, service.warranty.days)) : null,
        service_name: `${service.name} — ${client.trade_name}`,
      },
      generated_at_formatted: formatDateBR(startDate),
    };

    const html = renderServiceContractHtml(ctx, service.slug);
    const pdfBuffer = await htmlToPdfBuffer(html);
    const pdfPath = path.join(outDir, `${service.slug}.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log(`  ok — ${pdfPath}`);
  }

  console.log(`\n${services.length} contratos de serviço gerados em ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
