/**
 * Vercel Serverless Function (runtime Node — puppeteer-core/@sparticuz/chromium não rodam em
 * runtime Edge). Recebe { contract_id, document_type }, monta o DocumentContext a partir do
 * snapshot congelado do contrato (criando o snapshot na primeira geração), renderiza o PDF via
 * Chromium headless, sobe pro Storage e grava o histórico versionado.
 *
 * Suporta dois "mundos" mutuamente exclusivos por contract.contract_kind: "sistema" (produto
 * licenciado, pacote de até 10 páginas) e "servico" (pacote de preço fechado, contrato único e
 * enxuto). O branch de snapshot é se/senão, nunca dois "if"s sequenciais — um contrato de
 * serviço tem product_id null, então tentar buscar produto por ele sempre falharia.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../src/types/db.js";
import type { DocumentType } from "../../src/types/domain.js";
import { buildDocumentContext, buildServiceDocumentContext, renderDocumentHtml, renderServiceContractHtml } from "../../src/pdf/index.js";
import { htmlToPdfBuffer } from "../../src/pdf/render-node.js";

const DOCUMENT_TYPES: DocumentType[] = [
  "contrato",
  "termo_entrega",
  "manual",
  "doc_tecnica",
  "acessos",
  "backup",
  "checklist",
  "pacote_completo",
  "contrato_servico",
];

const SISTEMA_DOCUMENT_TYPES = new Set<DocumentType>([
  "contrato",
  "termo_entrega",
  "manual",
  "doc_tecnica",
  "acessos",
  "backup",
  "checklist",
  "pacote_completo",
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Configuração do servidor incompleta (Supabase)." });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Não autenticado." });
  }
  const accessToken = authHeader.slice("Bearer ".length);

  const admin = createClient<Database>(supabaseUrl, serviceRoleKey);

  const { data: userData, error: userError } = await admin.auth.getUser(accessToken);
  if (userError || !userData.user) {
    return res.status(401).json({ error: "Sessão inválida ou expirada." });
  }

  const { contract_id, document_type } = (req.body ?? {}) as {
    contract_id?: string;
    document_type?: DocumentType;
  };

  if (!contract_id || !document_type || !DOCUMENT_TYPES.includes(document_type)) {
    return res.status(400).json({ error: "contract_id e document_type (válido) são obrigatórios." });
  }

  const { data: contract, error: contractError } = await admin
    .from("contracts")
    .select("*")
    .eq("id", contract_id)
    .single();
  if (contractError || !contract) {
    return res.status(404).json({ error: "Contrato não encontrado." });
  }

  const isServiceContract = contract.contract_kind === "servico";
  const documentIsForSistema = SISTEMA_DOCUMENT_TYPES.has(document_type);
  if (isServiceContract === documentIsForSistema) {
    return res.status(400).json({
      error: `document_type "${document_type}" não é compatível com um contrato do tipo "${contract.contract_kind}".`,
    });
  }

  const { data: client, error: clientError } = await admin
    .from("clients")
    .select("*")
    .eq("id", contract.client_id)
    .single();
  if (clientError || !client) {
    return res.status(404).json({ error: "Cliente do contrato não encontrado." });
  }

  // Snapshot imutável: criado uma única vez, na primeira geração deste contrato.
  let { data: snapshot } = await admin
    .from("contract_snapshots")
    .select("*")
    .eq("contract_id", contract_id)
    .maybeSingle();

  if (!snapshot) {
    const { data: company, error: companyError } = await admin
      .from("company_settings")
      .select("*")
      .eq("id", true)
      .single();
    if (companyError || !company) {
      return res.status(500).json({ error: "Configurações da empresa (Base7 Web) não encontradas." });
    }

    const companySnapshot = {
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
    };

    if (isServiceContract) {
      if (!contract.service_id) {
        return res.status(400).json({ error: "Contrato de serviço sem service_id." });
      }
      const { data: service, error: serviceError } = await admin
        .from("services")
        .select("*")
        .eq("id", contract.service_id)
        .single();
      if (serviceError || !service) {
        return res.status(404).json({ error: "Serviço do contrato não encontrado." });
      }

      const { data: inserted, error: insertError } = await admin
        .from("contract_snapshots")
        .insert({
          contract_id,
          product_snapshot: null,
          service_snapshot: {
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
          company_snapshot: companySnapshot,
        })
        .select()
        .single();

      if (insertError || !inserted) {
        return res.status(500).json({ error: "Falha ao congelar o snapshot do contrato." });
      }
      snapshot = inserted;
    } else {
      if (!contract.product_id) {
        return res.status(400).json({ error: "Contrato de sistema sem product_id." });
      }
      const { data: product, error: productError } = await admin
        .from("products")
        .select("*")
        .eq("id", contract.product_id)
        .single();
      if (productError || !product) {
        return res.status(404).json({ error: "Produto do contrato não encontrado." });
      }

      const { data: inserted, error: insertError } = await admin
        .from("contract_snapshots")
        .insert({
          contract_id,
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
          service_snapshot: null,
          company_snapshot: companySnapshot,
        })
        .select()
        .single();

      if (insertError || !inserted) {
        return res.status(500).json({ error: "Falha ao congelar o snapshot do contrato." });
      }
      snapshot = inserted;
    }
  }

  let html: string;
  try {
    if (isServiceContract) {
      const ctx = buildServiceDocumentContext({ contract, client, snapshot });
      html = renderServiceContractHtml(ctx, ctx.service.slug);
    } else {
      const ctx = buildDocumentContext({ contract, client, snapshot });
      // Seguro: o check de documentIsForSistema acima já garante que document_type aqui nunca é "contrato_servico".
      html = renderDocumentHtml(document_type as Exclude<DocumentType, "contrato_servico">, ctx);
    }
  } catch (err) {
    return res.status(500).json({ error: `Falha ao montar o documento: ${(err as Error).message}` });
  }

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await htmlToPdfBuffer(html);
  } catch (err) {
    return res.status(500).json({ error: `Falha ao renderizar PDF: ${(err as Error).message}` });
  }

  // generated_documents: uma linha por (contrato, tipo de documento) — o histórico de versões
  // vive em document_versions, nunca apagamos uma versão anterior.
  let { data: genDoc } = await admin
    .from("generated_documents")
    .select("*")
    .eq("contract_id", contract_id)
    .eq("document_type", document_type)
    .maybeSingle();

  if (!genDoc) {
    const { data: inserted, error } = await admin
      .from("generated_documents")
      .insert({ contract_id, document_type })
      .select()
      .single();
    if (error || !inserted) {
      return res.status(500).json({ error: "Falha ao registrar o documento gerado." });
    }
    genDoc = inserted;
  }

  const { data: lastVersion } = await admin
    .from("document_versions")
    .select("version_number")
    .eq("generated_document_id", genDoc.id)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (lastVersion?.version_number ?? 0) + 1;
  const storagePath = `${contract_id}/${document_type}/v${nextVersion}.pdf`;

  const { error: uploadError } = await admin.storage.from("documents").upload(storagePath, pdfBuffer, {
    contentType: "application/pdf",
    upsert: false,
  });
  if (uploadError) {
    return res.status(500).json({ error: `Falha ao salvar o PDF: ${uploadError.message}` });
  }

  const { data: version, error: versionError } = await admin
    .from("document_versions")
    .insert({
      generated_document_id: genDoc.id,
      version_number: nextVersion,
      storage_path: storagePath,
      file_size: pdfBuffer.length,
      generated_by: userData.user.id,
    })
    .select()
    .single();
  if (versionError || !version) {
    return res.status(500).json({ error: "Falha ao registrar a versão do documento." });
  }

  await admin.from("generated_documents").update({ current_version_id: version.id }).eq("id", genDoc.id);

  if (contract.status === "rascunho") {
    await admin.from("contracts").update({ status: "gerado" }).eq("id", contract_id);
  }

  const { data: signed, error: signedError } = await admin.storage
    .from("documents")
    .createSignedUrl(storagePath, 60 * 10);
  if (signedError || !signed) {
    return res.status(500).json({ error: "PDF salvo, mas falhou ao gerar link de download." });
  }

  return res.status(200).json({
    url: signed.signedUrl,
    document_type,
    version: nextVersion,
    storage_path: storagePath,
  });
}

export const config = {
  maxDuration: 60,
};
