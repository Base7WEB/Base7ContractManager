-- Bucket privado: nenhum PDF é servido por URL pública direta. O backend (função de geração)
-- emite signed URLs sob demanda, sempre depois de validar a sessão do usuário.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "authenticated_read_documents" on storage.objects
  for select to authenticated
  using (bucket_id = 'documents');

create policy "authenticated_write_documents" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documents');

create policy "authenticated_update_documents" on storage.objects
  for update to authenticated
  using (bucket_id = 'documents');

create policy "authenticated_delete_documents" on storage.objects
  for delete to authenticated
  using (bucket_id = 'documents');
