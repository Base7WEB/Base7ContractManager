import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/db";

export type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
export type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
export type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];

const CLIENTS_KEY = ["clients"] as const;

export function useClientsQuery(search?: string) {
  return useQuery({
    queryKey: [...CLIENTS_KEY, { search: search ?? "" }],
    queryFn: async () => {
      let query = supabase.from("clients").select("*").order("created_at", { ascending: false });
      if (search) {
        query = query.or(`trade_name.ilike.%${search}%,legal_name.ilike.%${search}%,document.ilike.%${search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useClientQuery(id: string | undefined) {
  return useQuery({
    queryKey: [...CLIENTS_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateClientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ClientInsert) => {
      const { data, error } = await supabase.from("clients").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
    },
  });
}

export function useUpdateClientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: ClientUpdate & { id: string }) => {
      const { data, error } = await supabase.from("clients").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
      queryClient.invalidateQueries({ queryKey: [...CLIENTS_KEY, data.id] });
    },
  });
}
