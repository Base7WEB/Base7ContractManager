-- company_settings e care_settings são tabelas "singleton": nunca existe mais de uma linha.
-- Truque usado: chave primária boolean com CHECK (id) — só aceita id = true, e por ser PK
-- não pode haver duas linhas com id = true. Isso garante o singleton no próprio schema,
-- sem depender de disciplina da aplicação.

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function set_updated_at() is
  'Atualiza updated_at automaticamente em UPDATE. Usado via trigger nas tabelas mutáveis do app.';

create table company_settings (
  id boolean primary key default true check (id),
  name text not null default 'Base7 Web',
  legal_name text,
  -- CNPJ não é inventado — fica NULL até a Base7 Web preencher o valor real em Configurações.
  cnpj text,
  email text,
  phone text,
  address_street text,
  address_number text,
  address_complement text,
  address_neighborhood text,
  address_city text,
  address_state text,
  address_zip text,
  website text,
  logo_url text default '/imagem/logo-base7web.png',
  updated_at timestamptz not null default now()
);

create table care_settings (
  id boolean primary key default true check (id),
  -- BASE7 CARE é um plano único, global — não existe tabela de "planos", só este valor.
  monthly_price numeric(10, 2) not null default 249.90,
  description text not null default
    'Hospedagem, banco de dados, backups, monitoramento, manutenção, atualizações e suporte técnico.',
  is_offered boolean not null default true,
  updated_at timestamptz not null default now()
);

create trigger company_settings_set_updated_at
  before update on company_settings
  for each row execute function set_updated_at();

create trigger care_settings_set_updated_at
  before update on care_settings
  for each row execute function set_updated_at();

alter table company_settings enable row level security;
alter table care_settings enable row level security;

-- Ferramenta interna mono-tenant: qualquer usuário autenticado É um funcionário Base7 Web,
-- então basta checar autenticação — não há distinção de papel nem multi-tenant nesta v1.
create policy "authenticated_full_access" on company_settings
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on care_settings
  for all to authenticated using (true) with check (true);

insert into company_settings (id) values (true);
insert into care_settings (id) values (true);
