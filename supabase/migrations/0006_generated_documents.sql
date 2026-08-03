create table generated_documents (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts (id) on delete cascade,
  document_type text not null check (
    document_type in (
      'contrato', 'termo_entrega', 'manual', 'doc_tecnica',
      'acessos', 'backup', 'checklist', 'pacote_completo'
    )
  ),
  -- FK para document_versions adicionada no fim deste arquivo (referência circular entre as duas tabelas).
  current_version_id uuid,
  created_at timestamptz not null default now(),

  unique (contract_id, document_type)
);

-- Nunca apaga uma versão anterior — cada regeneração é uma nova linha aqui, e
-- generated_documents.current_version_id só aponta para a mais recente.
create table document_versions (
  id uuid primary key default gen_random_uuid(),
  generated_document_id uuid not null references generated_documents (id) on delete cascade,
  version_number int not null,
  storage_path text not null,
  file_size bigint,
  generated_by uuid references auth.users (id),
  generated_at timestamptz not null default now(),
  note text,

  unique (generated_document_id, version_number)
);

alter table generated_documents
  add constraint generated_documents_current_version_fkey
  foreign key (current_version_id) references document_versions (id);

create index document_versions_generated_document_id_idx on document_versions (generated_document_id);

alter table generated_documents enable row level security;
alter table document_versions enable row level security;

create policy "authenticated_full_access" on generated_documents
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on document_versions
  for all to authenticated using (true) with check (true);
