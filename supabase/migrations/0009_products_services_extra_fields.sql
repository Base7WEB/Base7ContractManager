-- Campos que faltavam para cadastrar sistemas/serviços pela UI: ícone (nome de componente
-- lucide-react, validado no client) e URL de produção (só faz sentido para produtos/sistemas,
-- que têm um deploy fixo por cliente instalado — serviços não têm URL própria).
alter table products add column icon text;
alter table products add column production_url text;

alter table services add column icon text;
