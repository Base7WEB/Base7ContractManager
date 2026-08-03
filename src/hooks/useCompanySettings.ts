import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/db";

export type CompanySettingsRow = Database["public"]["Tables"]["company_settings"]["Row"];
export type CompanySettingsUpdate = Database["public"]["Tables"]["company_settings"]["Update"];

const COMPANY_KEY = ["company_settings"] as const;

export function useCompanySettingsQuery() {
  return useQuery({
    queryKey: COMPANY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("company_settings").select("*").eq("id", true).single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateCompanySettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CompanySettingsUpdate) => {
      const { data, error } = await supabase.from("company_settings").update(input).eq("id", true).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_KEY });
    },
  });
}
