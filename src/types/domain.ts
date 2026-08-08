// Tipos de domínio para os blobs jsonb do banco (products.*, contracts.commercial/care) e
// para o snapshot congelado em contract_snapshots. Mantidos separados de db.ts (tipos "crus"
// do Supabase) para que o resto do app trabalhe com formas ricas e validadas por zod.

export interface ProductScope {
  modules: string[];
  integrations: string[];
  infrastructure: {
    frontend_hosting?: string;
    backend?: string;
    isolation_note?: string;
  };
  default_subdomain_pattern?: string;
}

export interface ProductLicense {
  type: "não exclusiva" | "exclusiva";
  transferability: "intransferível" | "transferível";
  term: "indeterminado" | "determinado";
  source_code_included: boolean;
  ip_clause_text: string;
}

export interface ProductWarranty {
  days: number;
  covered: string[];
  not_covered: string[];
  notes?: string;
}

export interface ProductTechDocs {
  frontend: string;
  backend: string;
  hosting: string;
  additional_services: string;
  architecture_text: string;
  deploy_text: string;
  security_bullets: string[];
}

export interface ProductBackupPolicy {
  frequency: string;
  retention: string;
  storage_location: string;
  restore_test_frequency: string;
  responsibilities_text: string;
}

export type ClientKind = "CNPJ" | "CPF";

export type ContractStatus = "rascunho" | "gerado" | "enviado" | "assinado" | "ativo" | "encerrado";

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  rascunho: "Rascunho",
  gerado: "Gerado",
  enviado: "Enviado",
  assinado: "Assinado",
  ativo: "Ativo",
  encerrado: "Encerrado",
};

export interface ContractCommercial {
  value: number;
  payment_method: string;
  term_days: number;
  start_date: string; // ISO date
  delivery_date: string; // ISO date
  // Só fazem sentido para contratos de sistema (contract_kind = "sistema").
  system_version?: string;
  subdomain?: string;
}

export interface ContractCare {
  active: boolean;
  monthly_price: number;
  start_date: string; // ISO date
  due_day: number; // 1-28
}

export type DocumentType =
  | "contrato"
  | "termo_entrega"
  | "manual"
  | "doc_tecnica"
  | "acessos"
  | "backup"
  | "checklist"
  | "pacote_completo"
  | "contrato_servico";

export const DOCUMENT_TYPE_LABEL: Record<DocumentType, string> = {
  contrato: "Contrato de Desenvolvimento + Licença",
  termo_entrega: "Termo de Entrega e Aceite",
  manual: "Manual de Uso do Sistema",
  doc_tecnica: "Documentação Técnica",
  acessos: "Acessos e Infraestrutura",
  backup: "Política de Backup e Continuidade",
  checklist: "Checklist de Fechamento",
  pacote_completo: "Pacote de Documentação Completo",
  contrato_servico: "Contrato de Prestação de Serviço",
};

/** "sistema" = contrato vinculado a um produto licenciado (products); "servico" = contrato
 * vinculado a um serviço de preço fechado (services). Mutuamente exclusivo — ver CHECK
 * constraint `contracts_kind_matches_link_check`. */
export type ContractKind = "sistema" | "servico";

export interface CompanySnapshot {
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
  logo_url: string | null;
}

export interface ProductSnapshot {
  slug: string;
  name: string;
  commercial_name: string | null;
  description: string | null;
  default_version: string;
  scope: ProductScope;
  license: ProductLicense;
  warranty: ProductWarranty;
  tech_docs: ProductTechDocs;
  backup_policy: ProductBackupPolicy;
}

export type ServiceCategory = "site" | "landing_page" | "trafego" | "consultoria" | "automacao" | "dashboard";

export const SERVICE_CATEGORY_LABEL: Record<ServiceCategory, string> = {
  site: "Site",
  landing_page: "Landing Page",
  trafego: "Tráfego Pago",
  consultoria: "Consultoria",
  automacao: "Automação",
  dashboard: "Dashboard",
};

export type ServicePricePeriod = "unico" | "mensal";

export interface ServiceScope {
  object_text: string;
  deliverables: string[];
  exclusions: string[];
  client_responsibilities: string[];
}

export interface ServicePaymentTerms {
  default_method: string;
  term_days: number | null;
  recurring: boolean;
  renewal_text: string | null;
}

export interface ServiceWarranty {
  days: number | null;
  notes: string;
}

/** Congelado em contract_snapshots.service_snapshot na primeira geração de PDF de um contrato
 * de serviço — os templates de contrato de serviço sempre leem daqui, nunca de `services` ao
 * vivo, pelo mesmo motivo de ProductSnapshot. */
export interface ServiceSnapshot {
  slug: string;
  name: string;
  badge: string | null;
  tagline: string;
  category: ServiceCategory;
  price: number;
  price_prefix: string;
  price_period: ServicePricePeriod;
  delivery_text: string;
  items: string[];
  scope: ServiceScope;
  payment_terms: ServicePaymentTerms;
  warranty: ServiceWarranty;
}
