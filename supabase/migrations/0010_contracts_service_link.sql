-- Torna `contracts` polimórfico entre Sistema (products) e Serviço (services). Usa uma coluna
-- discriminadora (`contract_kind`, ergonomia no app) + um CHECK que amarra o discriminador aos
-- FKs (integridade no banco) — nenhuma das duas sozinha seria suficiente.
--
-- O `default 'sistema'` é essencial: o deploy do schema (Supabase) e do frontend (Vercel) não
-- são atômicos entre si. Com o default, o código antigo (que ainda insere contratos sem
-- `contract_kind`) continua funcionando sem alteração no intervalo entre os dois deploys.
begin;

alter table contracts add column contract_kind text not null default 'sistema'
  check (contract_kind in ('sistema', 'servico'));

alter table contracts add column service_id uuid references services (id);

alter table contracts alter column product_id drop not null;

alter table contracts add constraint contracts_kind_matches_link_check
  check (
    (contract_kind = 'sistema' and product_id is not null and service_id is null)
    or (contract_kind = 'servico' and service_id is not null and product_id is null)
  );

create index contracts_service_id_idx on contracts (service_id);

commit;
