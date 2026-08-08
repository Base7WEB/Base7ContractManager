-- Catálogo de serviços comerciais (tráfego pago, landing page, sites institucionais,
-- automações, consultoria etc.) — paralelo a `products` (sistemas licenciados), mas com
-- forma comercial diferente: preço fechado (único ou mensal), sem licença de software,
-- sem BASE7 CARE. Segue o mesmo princípio de `products`: novos serviços são só novas
-- linhas aqui, nenhum código/template precisa mudar.
create table services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  badge text, -- ex.: "Mais Popular" — exibido como destaque no card, null quando não houver
  tagline text not null, -- frase curta abaixo do nome (ex.: "Para quem precisa de presença digital profissional")
  category text not null check (
    category in ('site', 'landing_page', 'trafego', 'consultoria', 'automacao', 'dashboard')
  ),
  status text not null default 'active' check (status in ('active', 'inactive')),

  price numeric(10, 2) not null,
  price_prefix text not null default '', -- '' ou 'A partir de'
  price_period text not null default 'unico' check (price_period in ('unico', 'mensal')),
  delivery_text text not null, -- ex.: "Entrega em até 7 dias", "Contínuo, mês a mês"

  items jsonb not null default '[]'::jsonb, -- string[] — bullets exibidos no card/página do serviço
  -- { object_text, deliverables: string[], exclusions: string[], client_responsibilities: string[] }
  scope jsonb not null default '{}'::jsonb,
  -- { default_method, term_days: number|null, recurring: boolean, renewal_text: string|null }
  payment_terms jsonb not null default '{}'::jsonb,
  -- { days: number|null, notes: string }
  warranty jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger services_set_updated_at
  before update on services
  for each row execute function set_updated_at();

alter table services enable row level security;

create policy "authenticated_full_access" on services
  for all to authenticated using (true) with check (true);
