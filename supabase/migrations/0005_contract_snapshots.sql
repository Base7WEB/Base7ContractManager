-- Capturado uma única vez, na primeira geração de documento de cada contrato, e nunca mais
-- atualizado. Garante que editar um produto (products) no futuro NUNCA altera retroativamente
-- um contrato já emitido — os templates de PDF sempre leem daqui, não da tabela products.
create table contract_snapshots (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null unique references contracts (id) on delete cascade,

  product_snapshot jsonb not null,
  company_snapshot jsonb not null,

  created_at timestamptz not null default now()
);

alter table contract_snapshots enable row level security;

create policy "authenticated_full_access" on contract_snapshots
  for all to authenticated using (true) with check (true);
