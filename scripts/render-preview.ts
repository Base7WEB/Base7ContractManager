/* Renderiza o pacote de documentação completo localmente, sem depender do endpoint serverless
 * nem de um projeto Supabase — útil para validar visualmente os templates de PDF durante o
 * desenvolvimento. Usa dados fictícios (a mesma demonstração "Dom Corte" do seed).
 * Rodar: npm run pdf:preview
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPackageHtml, type DocumentContext } from "../src/pdf";
import { htmlToPdfBuffer } from "../src/pdf/render-node";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ctx: DocumentContext = {
  company: {
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
  },
  product: {
    slug: "base7-system-barber",
    name: "BASE7 System Barber",
    commercial_name: "BASE7 System Barber",
    description: "Plataforma completa para barbearias.",
    default_version: "1.0.0",
    scope: {
      modules: [
        "Site institucional (Hero, Sobre, Serviços, Profissionais, Galeria, Avaliações, Localização)",
        "Agendamento online com disponibilidade calculada em tempo real",
        "Loja de produtos com carrinho e checkout (Pix, crédito e débito)",
        "Painel administrativo completo",
        "Chat ao vivo",
        "Botão de WhatsApp configurável",
      ],
      integrations: ["Mercado Pago", "Focus NFe", "WhatsApp"],
      infrastructure: { frontend_hosting: "Vercel", backend: "Supabase", isolation_note: "Projeto individual e isolado." },
      default_subdomain_pattern: "{cliente}.base7web.com.br",
    },
    license: {
      type: "não exclusiva",
      transferability: "intransferível",
      term: "indeterminado",
      source_code_included: false,
      ip_clause_text:
        "A concessão da licença de uso não implica cessão ou transferência de propriedade intelectual, código-fonte, arquitetura, componentes, metodologias ou demais ativos tecnológicos pertencentes à Base7 Web, salvo disposição expressa em instrumento específico.",
    },
    warranty: {
      days: 30,
      covered: ["Correção de bugs", "Correção de erros relacionados às funcionalidades contratadas"],
      not_covered: ["Novas funcionalidades", "Mudanças de escopo", "Uso incorreto"],
    },
    tech_docs: {
      frontend: "React 18 + TypeScript + Vite, Tailwind CSS + shadcn/ui",
      backend: "Supabase (Postgres + RLS + Auth + Storage)",
      hosting: "Vercel",
      additional_services: "Mercado Pago, Focus NFe",
      architecture_text: "SPA sem backend próprio, acessando o Supabase diretamente e Edge Functions para operações sensíveis.",
      deploy_text: "Push na branch principal → build → deploy automático → validação pós-deploy.",
      security_bullets: ["Secrets fora do repositório", "Princípio do menor privilégio", "Acessos individualizados"],
    },
    backup_policy: {
      frequency: "Diário",
      retention: "30 dias",
      storage_location: "Infraestrutura gerenciada Supabase",
      restore_test_frequency: "Mensal",
      responsibilities_text: "Com BASE7 CARE ativo, a Base7 Web executa as rotinas de backup.",
    },
  },
  client: {
    trade_name: "Barbearia Dom Corte",
    legal_name: "Dom Corte Barbearia e Estética Masculina LTDA",
    kind: "CNPJ",
    document_formatted: "12.345.678/0001-90",
    address_formatted: "Avenida Brasil, 1250, Jardim América, São José dos Campos — SP, CEP 12240-000",
    contact_name: "Rafael Henrique Almeida",
    contact_role: "Sócio Administrador",
    email: "contato@domcortebarber.com.br",
    phone: "(12) 99999-0000",
  },
  contract: {
    number: "0001/2026",
    status: "gerado",
    value_formatted: "R$ 4.500,00",
    payment_method: "À vista",
    term_days: 20,
    start_date_formatted: "05/08/2026",
    delivery_date_formatted: "25/08/2026",
    warranty_end_date_formatted: "24/09/2026",
    system_version: "1.0.0",
    subdomain: "domcorte.base7web.com.br",
    system_name: "BASE7 System Barber — Barbearia Dom Corte",
  },
  care: {
    monthly_price_formatted: "R$ 249,90",
    start_date_formatted: "25/08/2026",
    due_day: 10,
  },
  generated_at_formatted: "25/08/2026",
};

async function main() {
  const html = renderPackageHtml(ctx);
  const outDir = path.resolve(__dirname, "output");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "preview.html"), html, "utf-8");

  const pdfBuffer = await htmlToPdfBuffer(html);
  const pdfPath = path.join(outDir, "preview.pdf");
  fs.writeFileSync(pdfPath, pdfBuffer);

  console.log(`PDF gerado em ${pdfPath}`);
}

main();
