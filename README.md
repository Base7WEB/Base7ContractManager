# BASE7 Contract Manager

Ferramenta interna da **Base7 Web** para cadastrar clientes, selecionar produtos/sistemas
vendidos (ex.: BASE7 System Barber) e gerar automaticamente o pacote documental profissional
(contrato + licença, termo de entrega, manual, documentação técnica, acessos, backup e
checklist) em PDF — substituindo o preenchimento manual desses documentos a cada venda.

> Uso interno da equipe Base7 Web. Não é o produto vendido a clientes finais — para isso, veja
> o repositório irmão `base7web-system-barber` (e futuros `base7web-system-moda`,
> `-beauty`, `-clinica`).

## Como funciona

```
Admin → Novo contrato → seleciona cliente → seleciona produto (ex. BASE7 System Barber)
     → sistema carrega automaticamente escopo/licença/garantia/stack/backup do produto
     → admin preenche só os dados comerciais (valor, prazo, datas, BASE7 CARE)
     → revisão → gerar documentação → PDF A4 profissional, versionado e com histórico
```

Cada contrato guarda um **snapshot** imutável dos dados do produto no momento da geração —
editar um produto depois nunca altera contratos já emitidos.

## Stack

React 18 + TypeScript + Vite, Tailwind CSS + shadcn/ui, TanStack Query, React Router, Supabase
(Postgres + Auth + Storage + RLS). Geração de PDF via HTML/CSS renderizado por Chromium headless
(puppeteer-core + `@sparticuz/chromium`) em uma Vercel Serverless Function — o mesmo mecanismo
validado manualmente para reproduzir com fidelidade o PDF oficial de referência da Base7 Web.

Identidade visual própria (navy + azul de marca, amostrado do logo real em
`public/imagem/logo-base7web.png`) — este projeto não herda o tema do `base7web-system-barber`,
que é uma identidade por cliente instalado, não a marca corporativa.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencher com as chaves do projeto Supabase deste tool
npm run dev
```

Acesse `http://localhost:8090`. É necessário um usuário criado no Supabase Auth do projeto
(criação manual — não há tela de cadastro público).

## Estrutura

```
src/
  components/     UI (shadcn em components/ui, layout, auth, shared)
  pages/          uma pasta por área (clientes, produtos, contratos, configuracoes)
  contexts/       AuthContext
  lib/            supabase client, utils
  pdf/            motor de templates de documento (context + layout + templates/*)
  types/          tipos do banco (db.ts) e de domínio
supabase/
  migrations/     schema, em ordem (SQL puro)
scripts/
  seed.ts               popula produto BASE7 System Barber, BASE7 CARE, empresa e dados demo
  render-preview.ts     renderiza os templates de PDF localmente (dados mock), sem depender do serverless
  test-generate.ts      idem, mas lendo um contrato real do banco (útil para depurar o pipeline completo)
api/
  documents/generate.ts   Vercel Serverless Function que gera o PDF final
```

## Deploy

Produção: [base7-contract-manager.vercel.app](https://base7-contract-manager.vercel.app), a partir
do repositório [Base7WEB/Base7ContractManager](https://github.com/Base7WEB/Base7ContractManager)
(branch `main`, deploy automático a cada push).

Variáveis de ambiente necessárias no projeto Vercel (Settings → Environment Variables):
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (a última é usada
somente pela função `api/documents/generate.ts`; sem ela, o app funciona normalmente exceto pela
geração de PDF).

## Status

MVP completo — fluxo de ponta a ponta funcionando em produção: login → dashboard → clientes →
novo contrato (wizard) → geração de documentação (pacote completo ou por documento) → PDF real
baixado, versionado e listado no histórico. Validado com dados reais no Supabase de produção.

Pendências conhecidas / próximos passos:
- CNPJ da Base7 Web ainda não preenchido em Configurações → Empresa (aparece como
  "[a inserir]" nos contratos até ser cadastrado).
- `/configuracoes/templates` é um placeholder — fora do escopo do MVP.
- Sem tela de exclusão de clientes/contratos (CRUD é create/read/update por decisão de escopo).
- Bundle do frontend está acima de 500kB (aviso do Vite) — candidato a code-splitting por rota
  numa próxima iteração, não afeta funcionamento.
