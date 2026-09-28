# OpticaFlow Pro - Frontend

Interface web do OpticaFlow Pro, sistema de gestao de oticas: cadastros,
agenda, atendimentos e prontuarios, ordens de servico, estoque, compras,
vendas, financeiro, relatorios e auditoria.

## O que foi usado

- React 19 + TypeScript + Vite
- React Router, TanStack Query e Zustand
- React Hook Form + Zod
- Tailwind CSS e componentes shadcn/ui
- Axios

## Rodando localmente

```bash
cp .env.example .env   # VITE_API_URL aponta para a API
npm install
npm run dev
```

O app sobe em `http://localhost:5173`. A API fica no repositorio
[OpticaFlow-api](https://github.com/MMacedoS/OpticaFlow-api).

## Scripts

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: checagem de tipos e build de producao em `dist`
- `npm run lint`: ESLint
- `npm run preview`: serve o build localmente

## Deploy na Vercel

1. Importe este repositorio na Vercel (o preset Vite e detectado sozinho).
2. Defina `VITE_API_URL` com a URL da API no Render.
3. Depois do primeiro deploy, adicione o dominio da Vercel na variavel
   `FRONTEND_URL` da API, para liberar o CORS.

O [vercel.json](vercel.json) redireciona todas as rotas para o `index.html`, para
que recarregar uma pagina interna (ex.: `/ordens-servico`) nao de 404.

## CI

O workflow [.github/workflows/ci.yml](.github/workflows/ci.yml) roda lint e
build a cada push na `main` e em pull requests.
