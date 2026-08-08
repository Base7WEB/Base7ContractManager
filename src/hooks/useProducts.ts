import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/db";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

const PRODUCTS_KEY = ["products"] as const;

export function useProductsQuery() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useActiveProductsQuery() {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, "active"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("status", "active").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useProductQuery(id: string | undefined) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInsert) => {
      const { data, error } = await supabase.from("products").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: ProductUpdate & { id: string }) => {
      const { data, error } = await supabase.from("products").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: [...PRODUCTS_KEY, data.id] });
    },
  });
}
