-- Antes de rodar em produção, confirmar o nome real da constraint gerada pelo CHECK inline de
-- 0006_generated_documents.sql:
--   select conname from pg_constraint where conrelid = 'generated_documents'::regclass;
-- Ajustar o nome abaixo se divergir de `generated_documents_document_type_check`.
--
-- Um único tipo genérico "contrato_servico" (não um tipo por serviço): a granularidade por
-- oferta já existe na camada de templates (src/pdf/templates/servicos/*.ts, um arquivo por
-- serviço, selecionado pelo slug do serviço em runtime) — duplicá-la aqui no schema quebraria o
-- princípio de "novo serviço é só uma linha nova em `services`, nenhum schema muda".
begin;

alter table generated_documents drop constraint if exists generated_documents_document_type_check;

alter table generated_documents add constraint generated_documents_document_type_check
  check (
    document_type in (
      'contrato', 'termo_entrega', 'manual', 'doc_tecnica',
      'acessos', 'backup', 'checklist', 'pacote_completo',
      'contrato_servico'
    )
  );

commit;
