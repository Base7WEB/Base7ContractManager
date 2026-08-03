// Tipos do banco (Supabase). Gerados/escritos manualmente a partir das migrations em
// supabase/migrations — ver Fase 2 do plano. Placeholder até as migrations serem criadas.
export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
