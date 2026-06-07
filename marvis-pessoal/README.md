# Blue Pessoal

Blue e um assistente pessoal inspirado no Jarvis, construido de forma incremental para aprender arquitetura, frontend, backend, banco de dados e integracao com IA.

## Stack

- Frontend: React, TypeScript e Vite
- UI: Material UI e Framer Motion
- Backend: Node.js e Express
- Banco inicial: SQLite
- IA: OpenAI API

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

3. Rode frontend e backend juntos:

```bash
npm run dev
```

Frontend: `http://localhost:5174`

Backend: `http://localhost:3333`

## Projeto de teste

O primeiro contexto de teste e o projeto `Game of Thrones`. Ele serve para validar como o Blue organiza notas, historico, tarefas e conversas antes de implementarmos funcionalidades maiores.

## Arquitetura

O frontend segue uma estrutura modular:

- `components`: componentes reutilizaveis
- `pages`: telas completas
- `layouts`: estruturas de pagina
- `services`: comunicacao com APIs
- `hooks`: hooks reutilizaveis
- `contexts`: estados globais
- `types`: contratos de dados
- `utils`: funcoes auxiliares
- `features`: funcionalidades independentes

O backend separa configuracao, banco e modulos. Essa separacao reduz acoplamento e prepara migracao futura do SQLite para outro banco.

## Riscos tecnicos

- SQLite e otimo para inicio local, mas pode limitar uso multiusuario e sincronizacao com celular.
- Leitura de PDFs exige uma etapa posterior de extracao, indexacao e busca semantica.
- Agentes autonomos precisam de limites de seguranca antes de executar acoes reais.
- Integracoes com WhatsApp, Gmail e Calendar exigem autenticacao, permissoes e politicas especificas.

## Proximos passos sugeridos

1. Implementar listagem de conversas.
2. Criar CRUD de projetos.
3. Criar CRUD de tarefas.
4. Registrar memoria manualmente.
5. Planejar ingestao de arquivos Markdown antes de PDFs.
