create sequence contract_number_seq start 1;

create table contracts (
  id uuid primary key default gen_random_uuid(),

  -- Preenchido pelo trigger abaixo, formato "0001/2026".
  number text unique,

  client_id uuid not null references clients (id),
  product_id uuid not null references products (id),

  status text not null default 'rascunho'
    check (status in ('rascunho', 'gerado', 'enviado', 'assinado', 'ativo', 'encerrado')),

  -- { value, payment_method, term_days, start_date, delivery_date, system_version, subdomain }
  commercial jsonb not null default '{}'::jsonb,
  -- { active, monthly_price, start_date, due_day } — null quando o cliente não tem BASE7 CARE.
  care jsonb,

  is_demo boolean not null default false,

  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contracts_client_id_idx on contracts (client_id);
create index contracts_product_id_idx on contracts (product_id);
create index contracts_status_idx on contracts (status);

create or replace function generate_contract_number()
returns trigger
language plpgsql
as $$
begin
  if new.number is null then
    new.number := lpad(nextval('contract_number_seq')::text, 4, '0') || '/' || to_char(now(), 'YYYY');
  end if;
  return new;
end;
$$;

comment on function generate_contract_number() is
  'Gera o número do contrato no formato 0001/2026 na primeira inserção, se não informado.';

create trigger contracts_generate_number
  before insert on contracts
  for each row execute function generate_contract_number();

create trigger contracts_set_updated_at
  before update on contracts
  for each row execute function set_updated_at();

alter table contracts enable row level security;

create policy "authenticated_full_access" on contracts
  for all to authenticated using (true) with check (true);
