import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltam VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copie .env.example para .env.local e preencha com as credenciais do projeto Supabase.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
