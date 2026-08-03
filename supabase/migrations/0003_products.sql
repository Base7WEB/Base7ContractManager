-- Modelo genérico de produto: escopo/licença/garantia/stack/backup ficam em jsonb porque
-- são sempre lidos e escritos como um "documento" coeso (viram texto direto nos PDFs),
-- normalizar em tabelas separadas (product_features, product_integrations, ...) traria
-- complexidade sem ganho real de consulta. Novos produtos (Moda, Beauty, Clínica) são só
-- novas linhas aqui — nenhum código/template precisa mudar.
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  commercial_name text,
  description text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  default_version text not null default '1.0.0',

  -- { modules: string[], integrations: string[], infrastructure: {...}, default_subdomain_pattern }
  scope jsonb not null default '{}'::jsonb,
  -- { type, exclusivity, transferability, term, source_code_included, ip_clause_text }
  license jsonb not null default '{}'::jsonb,
  -- { days, covered: string[], not_covered: string[], notes }
  warranty jsonb not null default '{}'::jsonb,
  -- { frontend, backend, hosting, additional_services, architecture_text, deploy_text, security_bullets: string[] }
  tech_docs jsonb not null default '{}'::jsonb,
  -- { frequency, retention, storage_location, restore_test_frequency, responsibilities_text }
  backup_policy jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

alter table products enable row level security;

create policy "authenticated_full_access" on products
  for all to authenticated using (true) with check (true);
