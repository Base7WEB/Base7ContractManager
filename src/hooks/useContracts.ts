import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/db";
import type { ClientRow } from "./useClients";
import type { ProductRow } from "./useProducts";

export type ContractRow = Database["public"]["Tables"]["contracts"]["Row"];
export type ContractInsert = Database["public"]["Tables"]["contracts"]["Insert"];

export interface ContractWithRelations extends ContractRow {
  client: ClientRow;
  product: ProductRow;
}

const CONTRACTS_KEY = ["contracts"] as const;

async function attachRelations(contracts: ContractRow[]): Promise<ContractWithRelations[]> {
  if (contracts.length === 0) return [];

  const clientIds = [...new Set(contracts.map((c) => c.client_id))];
  const productIds = [...new Set(contracts.map((c) => c.product_id))];

  const [{ data: clients, error: clientsError }, { data: products, error: productsError }] = await Promise.all([
    supabase.from("clients").select("*").in("id", clientIds),
    supabase.from("products").select("*").in("id", productIds),
  ]);
  if (clientsError) throw clientsError;
  if (productsError) throw productsError;

  const clientsById = new Map((clients ?? []).map((c) => [c.id, c]));
  const productsById = new Map((products ?? []).map((p) => [p.id, p]));

  return contracts.map((contract) => ({
    ...contract,
    client: clientsById.get(contract.client_id)!,
    product: productsById.get(contract.product_id)!,
  }));
}

export function useContractsQuery() {
  return useQuery({
    queryKey: CONTRACTS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return attachRelations(data);
    },
  });
}

export function useContractQuery(id: string | undefined) {
  return useQuery({
    queryKey: [...CONTRACTS_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase.from("contracts").select("*").eq("id", id!).single();
      if (error) throw error;
      const [withRelations] = await attachRelations([data]);
      return withRelations;
    },
    enabled: Boolean(id),
  });
}

export function useCreateContractMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ContractInsert) => {
      const { data, error } = await supabase.from("contracts").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTRACTS_KEY });
    },
  });
}

export function invalidateContract(queryClient: ReturnType<typeof useQueryClient>, id: string) {
  queryClient.invalidateQueries({ queryKey: CONTRACTS_KEY });
  queryClient.invalidateQueries({ queryKey: [...CONTRACTS_KEY, id] });
}
