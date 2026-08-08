/* Popula o Supabase com o catálogo inicial (BASE7 System Barber, BASE7 CARE) e um cliente +
 * contrato de demonstração (Dom Corte, fictício, is_demo = true).
 * Rodar uma única vez, localmente:
 *   SUPABASE_SERVICE_ROLE_KEY=<sua-service-role-key> npm run seed
 * A service_role key nunca deve ir para .env.local nem ser commitada. */
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/db";
import type { ProductBackupPolicy, ProductLicense, ProductScope, ProductTechDocs, ProductWarranty } from "../src/types/domain";
import { services } from "./data/serviceCatalog";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Defina VITE_SUPABASE_URL (em .env.local) e SUPABASE_SERVICE_ROLE_KEY (só na variável de ambiente da chamada) antes de rodar.",
  );
  process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY);

// ---------- BASE7 System Barber ----------
// Fonte: README do base7web-system-barber + o pacote documental já validado manualmente
// nesta mesma linha de trabalho (Base7_Web_CONTRATO-DomCorte-PREENCHIDO.pdf).

const barberScope: ProductScope = {
  modules: [
    "Site institucional (Hero, Sobre, Serviços, Profissionais, Galeria, Avaliações, Localização)",
    "Agendamento online com disponibilidade calculada em tempo real no backend",
    "Loja de produtos com carrinho e checkout (Pix, crédito e débito)",
    "Painel administrativo completo (agenda, serviços, profissionais, produtos/estoque, clientes, pedidos, entregas, relatórios, avaliações, chat, conteúdo)",
    "Chat ao vivo entre visitante e barbearia",
    "Botão de WhatsApp configurável",
  ],
  integrations: [
    "Mercado Pago (Pix e cartão via Brick oficial) — conta própria da CONTRATANTE",
    "Focus NFe (emissão de NFC-e) — conta própria da CONTRATANTE",
    "WhatsApp",
  ],
  infrastructure: {
    frontend_hosting: "Vercel",
    backend: "Supabase (Postgres + Row Level Security + Auth + Storage + Realtime)",
    isolation_note: "Projeto Supabase e deploy Vercel individuais e isolados por cliente instalado.",
  },
  default_subdomain_pattern: "{cliente}.base7web.com.br",
};

const barberLicense: ProductLicense = {
  type: "não exclusiva",
  transferability: "intransferível",
  term: "indeterminado",
  source_code_included: false,
  ip_clause_text:
    "A concessão da licença de uso não implica cessão ou transferência de propriedade intelectual, código-fonte, arquitetura, componentes, metodologias ou demais ativos tecnológicos pertencentes à Base7 Web, salvo disposição expressa em instrumento específico.",
};

const barberWarranty: ProductWarranty = {
  days: 30,
  covered: [
    "Correção de bugs",
    "Correção de erros relacionados às funcionalidades contratadas",
    "Ajustes necessários para que o sistema opere conforme o escopo aprovado",
  ],
  not_covered: [
    "Novas funcionalidades",
    "Mudanças de escopo",
    "Alterações solicitadas pelo cliente",
    "Problemas causados por serviços externos",
    "Alterações realizadas por terceiros",
    "Problemas decorrentes de uso incorreto",
  ],
};

const barberTechDocs: ProductTechDocs = {
  frontend: "React 18 + TypeScript + Vite, Tailwind CSS + shadcn/ui, TanStack Query, React Router, Framer Motion",
  backend: "Supabase (Postgres + Row Level Security + Auth + Storage + Realtime)",
  hosting: "Vercel",
  additional_services: "Mercado Pago (API Orders), Focus NFe (emissão de NFC-e)",
  architecture_text:
    "SPA sem backend próprio: o frontend acessa o Supabase diretamente (Postgres, RLS, Auth) e aciona Edge Functions (Deno) para operações sensíveis — pagamentos, fiscal e webhooks. Preço, estoque e disponibilidade de horário são sempre recalculados no banco no momento da compra/agendamento.",
  deploy_text:
    "Push na branch principal → build Vite → deploy automático na Vercel → validação pós-deploy (agendamento de ponta a ponta e checkout Pix em sandbox).",
  security_bullets: [
    "Secrets fora do repositório",
    "Princípio do menor privilégio",
    "Acessos individualizados",
    "Rotação de credenciais quando necessário",
  ],
};

const barberBackupPolicy: ProductBackupPolicy = {
  frequency: "Diário (banco de dados e uploads/mídia)",
  retention: "30 dias",
  storage_location: "Infraestrutura gerenciada Supabase",
  restore_test_frequency: "Mensal",
  responsibilities_text:
    "Com BASE7 CARE ativo, a Base7 Web executa as rotinas de backup, monitoramento e teste de restauração. Serviços de terceiros seguem políticas próprias.",
};

// ---------- BASE7WEB System Moda 2.0 ----------

const modaScope: ProductScope = {
  modules: [
    "Site institucional com catálogo por categoria (Moda / Beleza)",
    "Carrinho de compras e checkout completo (Pix, crédito e débito)",
    "Cálculo de frete por CEP",
    "Emissão automática de NFC-e",
    "Chat ao vivo entre visitante e loja",
    "Painel administrativo completo (produtos/estoque, clientes, pedidos, entregas, relatórios, avaliações, conteúdo)",
  ],
  integrations: [
    "Mercado Pago (Pix e cartão) — conta própria da CONTRATANTE",
    "Focus NFe (emissão de NFC-e) — conta própria da CONTRATANTE",
    "Cálculo de frete por CEP",
  ],
  infrastructure: {
    frontend_hosting: "Vercel",
    backend: "Supabase (Postgres + Row Level Security + Auth + Storage)",
    isolation_note: "Projeto Supabase e deploy Vercel individuais e isolados por cliente instalado.",
  },
  default_subdomain_pattern: "{cliente}.base7web.com.br",
};

const modaLicense: ProductLicense = {
  type: "não exclusiva",
  transferability: "intransferível",
  term: "indeterminado",
  source_code_included: false,
  ip_clause_text:
    "A concessão da licença de uso não implica cessão ou transferência de propriedade intelectual, código-fonte, arquitetura, componentes, metodologias ou demais ativos tecnológicos pertencentes à Base7 Web, salvo disposição expressa em instrumento específico.",
};

const modaWarranty: ProductWarranty = {
  days: 30,
  covered: [
    "Correção de bugs",
    "Correção de erros relacionados às funcionalidades contratadas",
    "Ajustes necessários para que o sistema opere conforme o escopo aprovado",
  ],
  not_covered: [
    "Novas funcionalidades",
    "Mudanças de escopo",
    "Alterações solicitadas pelo cliente",
    "Problemas causados por serviços externos",
    "Alterações realizadas por terceiros",
    "Problemas decorrentes de uso incorreto",
  ],
};

const modaTechDocs: ProductTechDocs = {
  frontend: "React 18 + TypeScript + Vite, Tailwind CSS + shadcn/ui, TanStack Query, React Router",
  backend: "Supabase (Postgres + Row Level Security + Auth + Storage)",
  hosting: "Vercel",
  additional_services: "Mercado Pago (SDK oficial), Focus NFe (emissão de NFC-e)",
  architecture_text:
    "SPA sem backend próprio: o frontend acessa o Supabase diretamente (Postgres, RLS, Auth) e aciona Edge Functions para operações sensíveis — pagamentos, fiscal e webhooks. Preço, estoque e frete são sempre recalculados no banco no momento da compra.",
  deploy_text:
    "Push na branch principal → build Vite → deploy automático na Vercel → validação pós-deploy (checkout Pix em sandbox e emissão de nota de teste).",
  security_bullets: [
    "Secrets fora do repositório",
    "Princípio do menor privilégio",
    "Acessos individualizados",
    "Rotação de credenciais quando necessário",
  ],
};

const modaBackupPolicy: ProductBackupPolicy = {
  frequency: "Diário (banco de dados e uploads/mídia)",
  retention: "30 dias",
  storage_location: "Infraestrutura gerenciada Supabase",
  restore_test_frequency: "Mensal",
  responsibilities_text:
    "Com BASE7 CARE ativo, a Base7 Web executa as rotinas de backup, monitoramento e teste de restauração. Serviços de terceiros seguem políticas próprias.",
};

// ---------- BASE7WEB Beauty System ----------

const beautyScope: ProductScope = {
  modules: [
    "Site institucional (Início, Sobre, Serviços/Estética, Contato)",
    "Agendamento online com disponibilidade em tempo real",
    "Painel administrativo (agendamentos, serviços, métricas, chat, conteúdo)",
    "Chat ao vivo entre visitante e salão/clínica",
  ],
  integrations: ["WhatsApp"],
  infrastructure: {
    frontend_hosting: "Vercel",
    backend: "Supabase (Postgres + Row Level Security + Auth + Storage)",
    isolation_note: "Projeto Supabase e deploy Vercel individuais e isolados por cliente instalado.",
  },
  default_subdomain_pattern: "{cliente}.base7web.com.br",
};

const beautyLicense: ProductLicense = {
  type: "não exclusiva",
  transferability: "intransferível",
  term: "indeterminado",
  source_code_included: false,
  ip_clause_text:
    "A concessão da licença de uso não implica cessão ou transferência de propriedade intelectual, código-fonte, arquitetura, componentes, metodologias ou demais ativos tecnológicos pertencentes à Base7 Web, salvo disposição expressa em instrumento específico.",
};

const beautyWarranty: ProductWarranty = {
  days: 30,
  covered: [
    "Correção de bugs",
    "Correção de erros relacionados às funcionalidades contratadas",
    "Ajustes necessários para que o sistema opere conforme o escopo aprovado",
  ],
  not_covered: [
    "Novas funcionalidades",
    "Mudanças de escopo",
    "Alterações solicitadas pelo cliente",
    "Problemas causados por serviços externos",
    "Alterações realizadas por terceiros",
    "Problemas decorrentes de uso incorreto",
  ],
};

const beautyTechDocs: ProductTechDocs = {
  frontend: "React 18 + TypeScript + Vite, Tailwind CSS + shadcn/ui, TanStack Query, React Router",
  backend: "Supabase (Postgres + Row Level Security + Auth + Storage)",
  hosting: "Vercel",
  additional_services: "WhatsApp (contato direto)",
  architecture_text:
    "SPA sem backend próprio: o frontend acessa o Supabase diretamente (Postgres, RLS, Auth). Disponibilidade de horário é sempre recalculada no banco no momento do agendamento.",
  deploy_text: "Push na branch principal → build Vite → deploy automático na Vercel → validação pós-deploy (agendamento de ponta a ponta).",
  security_bullets: [
    "Secrets fora do repositório",
    "Princípio do menor privilégio",
    "Acessos individualizados",
    "Rotação de credenciais quando necessário",
  ],
};

const beautyBackupPolicy: ProductBackupPolicy = {
  frequency: "Diário (banco de dados e uploads/mídia)",
  retention: "30 dias",
  storage_location: "Infraestrutura gerenciada Supabase",
  restore_test_frequency: "Mensal",
  responsibilities_text:
    "Com BASE7 CARE ativo, a Base7 Web executa as rotinas de backup, monitoramento e teste de restauração. Serviços de terceiros seguem políticas próprias.",
};

async function main() {
  console.log("Populando BASE7 System Barber...");
  const { data: product, error: productError } = await supabase
    .from("products")
    .upsert(
      {
        slug: "base7-system-barber",
        name: "BASE7 System Barber",
        commercial_name: "BASE7 System Barber",
        description:
          "Plataforma completa para barbearias: site institucional, agendamento online, loja de produtos com checkout real, painel administrativo, integração fiscal (NFC-e) e emissão automática de nota.",
        status: "active",
        default_version: "1.0.0",
        icon: "Scissors",
        production_url: null,
        scope: barberScope,
        license: barberLicense,
        warranty: barberWarranty,
        tech_docs: barberTechDocs,
        backup_policy: barberBackupPolicy,
      },
      { onConflict: "slug" },
    )
    .select()
    .single();

  if (productError || !product) {
    console.error("Falha ao criar produto BASE7 System Barber:", productError?.message);
    process.exit(1);
  }
  console.log(`  ok — id ${product.id}`);

  console.log("Populando BASE7WEB System Moda 2.0...");
  const { error: modaError } = await supabase.from("products").upsert(
    {
      slug: "base7web-system-moda",
      name: "BASE7WEB System Moda 2.0",
      commercial_name: "BASE7WEB System Moda 2.0",
      description:
        "E-commerce completo para lojas de moda e beleza: catálogo por categoria, carrinho e checkout com Pix/cartão, cálculo de frete, emissão de NFC-e, chat ao vivo e painel administrativo completo.",
      status: "active",
      default_version: "2.0.0",
      icon: "Shirt",
      production_url: null,
      scope: modaScope,
      license: modaLicense,
      warranty: modaWarranty,
      tech_docs: modaTechDocs,
      backup_policy: modaBackupPolicy,
    },
    { onConflict: "slug" },
  );
  if (modaError) {
    console.error("Falha ao criar produto BASE7WEB System Moda 2.0:", modaError.message);
    process.exit(1);
  }
  console.log("  ok");

  console.log("Populando BASE7WEB Beauty System...");
  const { error: beautyError } = await supabase.from("products").upsert(
    {
      slug: "base7web-beauty-system",
      name: "BASE7WEB Beauty System",
      commercial_name: "BASE7WEB Beauty System",
      description:
        "Site, agendamento online e painel administrativo para salões de beleza e clínicas de estética.",
      status: "active",
      default_version: "1.0.0",
      icon: "Sparkles",
      production_url: null,
      scope: beautyScope,
      license: beautyLicense,
      warranty: beautyWarranty,
      tech_docs: beautyTechDocs,
      backup_policy: beautyBackupPolicy,
    },
    { onConflict: "slug" },
  );
  if (beautyError) {
    console.error("Falha ao criar produto BASE7WEB Beauty System:", beautyError.message);
    process.exit(1);
  }
  console.log("  ok");

  console.log("Populando catálogo de Serviços (9 pacotes)...");
  for (const service of services) {
    const { error: serviceError } = await supabase.from("services").upsert(
      {
        slug: service.slug,
        name: service.name,
        badge: service.badge,
        tagline: service.tagline,
        category: service.category,
        status: "active",
        icon: service.icon,
        price: service.price,
        price_prefix: service.price_prefix,
        price_period: service.price_period,
        delivery_text: service.delivery_text,
        items: service.items,
        scope: service.scope,
        payment_terms: service.payment_terms,
        warranty: service.warranty,
      },
      { onConflict: "slug" },
    );
    if (serviceError) {
      console.error(`Falha ao criar serviço ${service.name}:`, serviceError.message);
      process.exit(1);
    }
    console.log(`  ok — ${service.name}`);
  }

  console.log("Configurando BASE7 CARE (plano único)...");
  const { error: careError } = await supabase
    .from("care_settings")
    .update({ monthly_price: 249.9, is_offered: true })
    .eq("id", true);
  if (careError) {
    console.error("Falha ao configurar BASE7 CARE:", careError.message);
    process.exit(1);
  }
  console.log("  ok — R$ 249,90/mês");

  console.log("Configurando dados da empresa (Base7 Web)...");
  const { error: companyError } = await supabase
    .from("company_settings")
    .update({ name: "Base7 Web" })
    .eq("id", true);
  if (companyError) {
    console.error("Falha ao configurar empresa:", companyError.message);
    process.exit(1);
  }
  console.log("  ok (CNPJ deixado em branco — preencher em Configurações > Empresa)");

  console.log("Criando cliente de demonstração (Dom Corte, fictício)...");
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .upsert(
      {
        kind: "CNPJ",
        trade_name: "Barbearia Dom Corte",
        legal_name: "Dom Corte Barbearia e Estética Masculina LTDA",
        document: "12345678000190",
        address_street: "Avenida Brasil",
        address_number: "1250",
        address_complement: null,
        address_neighborhood: "Jardim América",
        address_city: "São José dos Campos",
        address_state: "SP",
        address_zip: "12240000",
        contact_name: "Rafael Henrique Almeida",
        contact_role: "Sócio Administrador",
        contact_document: null,
        email: "contato@domcortebarber.com.br",
        phone: "(12) 99999-0000",
        notes: "Cliente fictício, criado apenas para demonstração do BASE7 Contract Manager.",
        is_demo: true,
      },
      { onConflict: "document" },
    )
    .select()
    .single();

  if (clientError || !client) {
    console.error("Falha ao criar cliente demo:", clientError?.message);
    process.exit(1);
  }
  console.log(`  ok — id ${client.id}`);

  console.log("Criando contrato de demonstração (0001/2026)...");
  const { data: existingContract } = await supabase
    .from("contracts")
    .select("id")
    .eq("number", "0001/2026")
    .maybeSingle();

  if (existingContract) {
    console.log("  já existe — pulando.");
  } else {
    const { error: contractError } = await supabase.from("contracts").insert({
      number: "0001/2026",
      client_id: client.id,
      contract_kind: "sistema",
      product_id: product.id,
      service_id: null,
      status: "gerado",
      is_demo: true,
      commercial: {
        value: 4500,
        payment_method: "À vista",
        term_days: 20,
        start_date: "2026-08-05",
        delivery_date: "2026-08-25",
        system_version: "1.0.0",
        subdomain: "domcorte.base7web.com.br",
      },
      care: {
        active: true,
        monthly_price: 249.9,
        start_date: "2026-08-25",
        due_day: 10,
      },
    });
    if (contractError) {
      console.error("Falha ao criar contrato demo:", contractError.message);
      process.exit(1);
    }
    console.log("  ok");
  }

  console.log("\nSeed concluído.");
}

main();
