-- Contratos de serviço congelam um `service_snapshot` em vez de `product_snapshot`, pelo mesmo
-- motivo de sempre (editar o catálogo depois nunca deve alterar um contrato já emitido).
-- Nenhuma coluna nova é NOT NULL, então nada quebra no snapshot de sistema já existente.
begin;

alter table contract_snapshots alter column product_snapshot drop not null;
alter table contract_snapshots add column service_snapshot jsonb;

alter table contract_snapshots add constraint contract_snapshots_kind_check
  check ((product_snapshot is not null) <> (service_snapshot is not null));

commit;
