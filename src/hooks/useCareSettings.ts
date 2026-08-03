import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/db";

export type CareSettingsRow = Database["public"]["Tables"]["care_settings"]["Row"];
export type CareSettingsUpdate = Database["public"]["Tables"]["care_settings"]["Update"];

const CARE_KEY = ["care_settings"] as const;

export function useCareSettingsQuery() {
  return useQuery({
    queryKey: CARE_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("care_settings").select("*").eq("id", true).single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateCareSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CareSettingsUpdate) => {
      const { data, error } = await supabase.from("care_settings").update(input).eq("id", true).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARE_KEY });
    },
  });
}
