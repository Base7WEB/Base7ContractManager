import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/db";

export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
export type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

const SERVICES_KEY = ["services"] as const;

export function useServicesQuery() {
  return useQuery({
    queryKey: SERVICES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("price");
      if (error) throw error;
      return data;
    },
  });
}

export function useActiveServicesQuery() {
  return useQuery({
    queryKey: [...SERVICES_KEY, "active"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("status", "active").order("price");
      if (error) throw error;
      return data;
    },
  });
}

export function useServiceQuery(id: string | undefined) {
  return useQuery({
    queryKey: [...SERVICES_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ServiceInsert) => {
      const { data, error } = await supabase.from("services").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY });
    },
  });
}

export function useUpdateServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: ServiceUpdate & { id: string }) => {
      const { data, error } = await supabase.from("services").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY });
      queryClient.invalidateQueries({ queryKey: [...SERVICES_KEY, data.id] });
    },
  });
}
