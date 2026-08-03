import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/db";

export type GeneratedDocumentRow = Database["public"]["Tables"]["generated_documents"]["Row"];
export type DocumentVersionRow = Database["public"]["Tables"]["document_versions"]["Row"];

export interface DocumentWithVersions extends GeneratedDocumentRow {
  versions: DocumentVersionRow[];
}

const DOCS_KEY = ["generated_documents"] as const;

export function useContractDocumentsQuery(contractId: string | undefined) {
  return useQuery({
    queryKey: [...DOCS_KEY, "by-contract", contractId],
    queryFn: async () => {
      const { data: docs, error: docsError } = await supabase
        .from("generated_documents")
        .select("*")
        .eq("contract_id", contractId!);
      if (docsError) throw docsError;
      if (!docs || docs.length === 0) return [] as DocumentWithVersions[];

      const { data: versions, error: versionsError } = await supabase
        .from("document_versions")
        .select("*")
        .in(
          "generated_document_id",
          docs.map((d) => d.id),
        )
        .order("version_number", { ascending: false });
      if (versionsError) throw versionsError;

      return docs.map((doc) => ({
        ...doc,
        versions: (versions ?? []).filter((v) => v.generated_document_id === doc.id),
      }));
    },
    enabled: Boolean(contractId),
  });
}

export function useAllDocumentVersionsQuery() {
  return useQuery({
    queryKey: [...DOCS_KEY, "all"],
    queryFn: async () => {
      const { data: versions, error: versionsError } = await supabase
        .from("document_versions")
        .select("*")
        .order("generated_at", { ascending: false });
      if (versionsError) throw versionsError;
      if (!versions || versions.length === 0) return [];

      const { data: docs, error: docsError } = await supabase
        .from("generated_documents")
        .select("*")
        .in(
          "id",
          versions.map((v) => v.generated_document_id),
        );
      if (docsError) throw docsError;

      const contractIds = [...new Set((docs ?? []).map((d) => d.contract_id))];
      const { data: contracts, error: contractsError } = await supabase
        .from("contracts")
        .select("*")
        .in("id", contractIds);
      if (contractsError) throw contractsError;

      const clientIds = [...new Set((contracts ?? []).map((c) => c.client_id))];
      const { data: clients, error: clientsError } = await supabase.from("clients").select("*").in("id", clientIds);
      if (clientsError) throw clientsError;

      const docsById = new Map((docs ?? []).map((d) => [d.id, d]));
      const contractsById = new Map((contracts ?? []).map((c) => [c.id, c]));
      const clientsById = new Map((clients ?? []).map((c) => [c.id, c]));

      return versions.map((version) => {
        const doc = docsById.get(version.generated_document_id);
        const contract = doc ? contractsById.get(doc.contract_id) : undefined;
        const client = contract ? clientsById.get(contract.client_id) : undefined;
        return {
          version,
          document: doc,
          contract,
          client,
        };
      });
    },
  });
}

export function invalidateContractDocuments(queryClient: ReturnType<typeof useQueryClient>, contractId: string) {
  queryClient.invalidateQueries({ queryKey: [...DOCS_KEY, "by-contract", contractId] });
  queryClient.invalidateQueries({ queryKey: [...DOCS_KEY, "all"] });
}
