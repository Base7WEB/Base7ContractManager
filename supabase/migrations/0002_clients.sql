create table clients (
  id uuid primary key default gen_random_uuid(),

  kind text not null check (kind in ('CNPJ', 'CPF')),
  trade_name text not null,
  legal_name text not null,
  document text not null, -- CPF ou CNPJ, somente dígitos

  address_street text,
  address_number text,
  address_complement text,
  address_neighborhood text,
  address_city text,
  address_state text,
  address_zip text,

  contact_name text not null,
  contact_role text,
  contact_document text,
  email text,
  phone text,

  notes text,

  -- Marca registros de demonstração (seed) para a UI exibir um badge visível ao usuário,
  -- não é só um comentário de código — atende ao pedido de deixar claro o que é fictício.
  is_demo boolean not null default false,

  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index clients_document_key on clients (document);
create index clients_trade_name_idx on clients (trade_name);

create trigger clients_set_updated_at
  before update on clients
  for each row execute function set_updated_at();

alter table clients enable row level security;

create policy "authenticated_full_access" on clients
  for all to authenticated using (true) with check (true);
