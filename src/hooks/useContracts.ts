import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/db";
import type { ClientRow } from "./useClients";
import type { ProductRow } from "./useProducts";
import type { ServiceRow } from "./useServices";

export type ContractRow = Database["public"]["Tables"]["contracts"]["Row"];
export type ContractInsert = Database["public"]["Tables"]["contracts"]["Insert"];

export interface ContractWithRelations extends ContractRow {
  client: ClientRow;
  product: ProductRow | null;
  service: ServiceRow | null;
}

const CONTRACTS_KEY = ["contracts"] as const;

async function attachRelations(contracts: ContractRow[]): Promise<ContractWithRelations[]> {
  if (contracts.length === 0) return [];

  const clientIds = [...new Set(contracts.map((c) => c.client_id))];
  const productIds = [...new Set(contracts.map((c) => c.product_id).filter((id): id is string => Boolean(id)))];
  const serviceIds = [...new Set(contracts.map((c) => c.service_id).filter((id): id is string => Boolean(id)))];

  const [
    { data: clients, error: clientsError },
    { data: products, error: productsError },
    { data: servicesData, error: servicesError },
  ] = await Promise.all([
    supabase.from("clients").select("*").in("id", clientIds),
    productIds.length > 0
      ? supabase.from("products").select("*").in("id", productIds)
      : Promise.resolve({ data: [], error: null }),
    serviceIds.length > 0
      ? supabase.from("services").select("*").in("id", serviceIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (clientsError) throw clientsError;
  if (productsError) throw productsError;
  if (servicesError) throw servicesError;

  const clientsById = new Map((clients ?? []).map((c) => [c.id, c]));
  const productsById = new Map((products ?? []).map((p) => [p.id, p]));
  const servicesById = new Map((servicesData ?? []).map((s) => [s.id, s]));

  return contracts.map((contract) => ({
    ...contract,
    client: clientsById.get(contract.client_id)!,
    product: contract.product_id ? (productsById.get(contract.product_id) ?? null) : null,
    service: contract.service_id ? (servicesById.get(contract.service_id) ?? null) : null,
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
