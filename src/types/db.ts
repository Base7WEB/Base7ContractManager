// Tipos do banco escritos manualmente a partir de supabase/migrations (não há projeto Supabase
// vivo ainda para rodar `supabase gen types`). Ao aplicar as migrations num projeto real, é
// recomendável rodar a geração automática e comparar com este arquivo.
import type {
  ClientKind,
  CompanySnapshot,
  ContractCare,
  ContractCommercial,
  ContractKind,
  ContractStatus,
  DocumentType,
  ProductBackupPolicy,
  ProductLicense,
  ProductScope,
  ProductSnapshot,
  ProductTechDocs,
  ProductWarranty,
  ServiceCategory,
  ServicePaymentTerms,
  ServicePricePeriod,
  ServiceScope,
  ServiceSnapshot,
  ServiceWarranty,
} from "./domain";

export interface Database {
  public: {
    Tables: {
      company_settings: {
        Row: {
          id: true;
          name: string;
          legal_name: string | null;
          cnpj: string | null;
          email: string | null;
          phone: string | null;
          address_street: string | null;
          address_number: string | null;
          address_complement: string | null;
          address_neighborhood: string | null;
          address_city: string | null;
          address_state: string | null;
          address_zip: string | null;
          website: string | null;
          logo_url: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["company_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["company_settings"]["Row"]>;
        Relationships: [];
      };
      care_settings: {
        Row: {
          id: true;
          monthly_price: number;
          description: string;
          is_offered: boolean;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["care_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["care_settings"]["Row"]>;
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          kind: ClientKind;
          trade_name: string;
          legal_name: string;
          document: string;
          address_street: string | null;
          address_number: string | null;
          address_complement: string | null;
          address_neighborhood: string | null;
          address_city: string | null;
          address_state: string | null;
          address_zip: string | null;
          contact_name: string;
          contact_role: string | null;
          contact_document: string | null;
          email: string | null;
          phone: string | null;
          notes: string | null;
          is_demo: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["clients"]["Row"],
          "id" | "created_by" | "created_at" | "updated_at"
        > &
          Partial<Pick<Database["public"]["Tables"]["clients"]["Row"], "id" | "created_by" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["clients"]["Row"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          commercial_name: string | null;
          description: string | null;
          status: "active" | "inactive";
          default_version: string;
          icon: string | null;
          production_url: string | null;
          scope: ProductScope;
          license: ProductLicense;
          warranty: ProductWarranty;
          tech_docs: ProductTechDocs;
          backup_policy: ProductBackupPolicy;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at"> &
          Partial<Pick<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          name: string;
          badge: string | null;
          tagline: string;
          category: ServiceCategory;
          status: "active" | "inactive";
          icon: string | null;
          price: number;
          price_prefix: string;
          price_period: ServicePricePeriod;
          delivery_text: string;
          items: string[];
          scope: ServiceScope;
          payment_terms: ServicePaymentTerms;
          warranty: ServiceWarranty;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["services"]["Row"], "id" | "created_at" | "updated_at"> &
          Partial<Pick<Database["public"]["Tables"]["services"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
        Relationships: [];
      };
      contracts: {
        Row: {
          id: string;
          number: string;
          client_id: string;
          contract_kind: ContractKind;
          product_id: string | null;
          service_id: string | null;
          status: ContractStatus;
          commercial: ContractCommercial;
          care: ContractCare | null;
          is_demo: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["contracts"]["Row"],
          "id" | "number" | "created_by" | "created_at" | "updated_at"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["contracts"]["Row"],
              "id" | "number" | "created_by" | "created_at" | "updated_at"
            >
          >;
        Update: Partial<Database["public"]["Tables"]["contracts"]["Row"]>;
        Relationships: [];
      };
      contract_snapshots: {
        Row: {
          id: string;
          contract_id: string;
          product_snapshot: ProductSnapshot | null;
          service_snapshot: ServiceSnapshot | null;
          company_snapshot: CompanySnapshot;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contract_snapshots"]["Row"], "id" | "created_at"> &
          Partial<Pick<Database["public"]["Tables"]["contract_snapshots"]["Row"], "id" | "created_at">>;
        Update: Partial<Database["public"]["Tables"]["contract_snapshots"]["Row"]>;
        Relationships: [];
      };
      generated_documents: {
        Row: {
          id: string;
          contract_id: string;
          document_type: DocumentType;
          current_version_id: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["generated_documents"]["Row"],
          "id" | "current_version_id" | "created_at"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["generated_documents"]["Row"],
              "id" | "current_version_id" | "created_at"
            >
          >;
        Update: Partial<Database["public"]["Tables"]["generated_documents"]["Row"]>;
        Relationships: [];
      };
      document_versions: {
        Row: {
          id: string;
          generated_document_id: string;
          version_number: number;
          storage_path: string;
          file_size: number | null;
          generated_by: string | null;
          generated_at: string;
          note: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["document_versions"]["Row"],
          "id" | "file_size" | "generated_by" | "generated_at" | "note"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["document_versions"]["Row"],
              "id" | "file_size" | "generated_by" | "generated_at" | "note"
            >
          >;
        Update: Partial<Database["public"]["Tables"]["document_versions"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
