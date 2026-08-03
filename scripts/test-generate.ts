/* Teste manual único: replica a lógica de api/documents/generate.ts localmente, usando dados
 * reais do banco (não mock), para validar o pipeline completo antes do primeiro deploy.
 * Rodar: SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/test-generate.ts
 */
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/db";
import { buildDocumentContext, renderPackageHtml } from "../src/pdf";
import { htmlToPdfBuffer } from "../src/pdf/render-node";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const admin = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  const { data: contract, error: contractError } = await admin
    .from("contracts")
    .select("*")
    .eq("number", "0001/2026")
    .single();
  if (contractError || !contract) throw new Error(`Contrato não encontrado: ${contractError?.message}`);

  const { data: client, error: clientError } = await admin.from("clients").select("*").eq("id", contract.client_id).single();
  if (clientError || !client) throw new Error(`Cliente não encontrado: ${clientError?.message}`);

  let { data: snapshot } = await admin.from("contract_snapshots").select("*").eq("contract_id", contract.id).maybeSingle();
  if (!snapshot) {
    const { data: product, error: productError } = await admin.from("products").select("*").eq("id", contract.product_id).single();
    if (productError || !product) throw new Error(`Produto não encontrado: ${productError?.message}`);
    const { data: company, error: companyError } = await admin.from("company_settings").select("*").eq("id", true).single();
    if (companyError || !company) throw new Error(`Empresa não encontrada: ${companyError?.message}`);

    const { data: inserted, error: insertError } = await admin
      .from("contract_snapshots")
      .insert({
        contract_id: contract.id,
        product_snapshot: {
          slug: product.slug,
          name: product.name,
          commercial_name: product.commercial_name,
          description: product.description,
          default_version: product.default_version,
          scope: product.scope,
          license: product.license,
          warranty: product.warranty,
          tech_docs: product.tech_docs,
          backup_policy: product.backup_policy,
        },
        company_snapshot: {
          name: company.name,
          legal_name: company.legal_name,
          cnpj: company.cnpj,
          email: company.email,
          phone: company.phone,
          address_street: company.address_street,
          address_number: company.address_number,
          address_complement: company.address_complement,
          address_neighborhood: company.address_neighborhood,
          address_city: company.address_city,
          address_state: company.address_state,
          address_zip: company.address_zip,
          logo_url: company.logo_url,
        },
      })
      .select()
      .single();
    if (insertError || !inserted) throw new Error(`Falha ao criar snapshot: ${insertError?.message}`);
    snapshot = inserted;
    console.log("Snapshot criado a partir dos dados reais do banco.");
  } else {
    console.log("Snapshot já existia — reutilizando.");
  }

  const ctx = buildDocumentContext({ contract, client, snapshot });
  console.log("Contexto montado:", JSON.stringify({ contract: ctx.contract, client: { ...ctx.client } }, null, 2));

  const html = renderPackageHtml(ctx);
  const outDir = path.resolve(__dirname, "output");
  fs.mkdirSync(outDir, { recursive: true });
  const pdfBuffer = await htmlToPdfBuffer(html);
  const pdfPath = path.join(outDir, "test-generate-real-db.pdf");
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log(`PDF gerado a partir de dados reais em ${pdfPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
