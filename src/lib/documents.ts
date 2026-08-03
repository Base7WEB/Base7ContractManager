import { supabase } from "@/lib/supabase";
import type { DocumentType } from "@/types/domain";

export interface GenerateDocumentResult {
  url: string;
  document_type: DocumentType;
  version: number;
  storage_path: string;
}

/** Chama a função serverless que renderiza e versiona o PDF, autenticando com o token da sessão atual. */
export async function generateDocument(contractId: string, documentType: DocumentType): Promise<GenerateDocumentResult> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const response = await fetch("/api/documents/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ contract_id: contractId, document_type: documentType }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error ?? "Falha ao gerar o documento.");
  }
  return payload as GenerateDocumentResult;
}
