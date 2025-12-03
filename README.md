# Code34

Aplicativo que ensina programação por meio de exercícios. Inclui backend (Node.js + Express + Prisma + PostgreSQL) e frontend (React Native / Expo). Monetização via PIX por linguagem, com 34 exercícios gratuitos de lógica e 34 por linguagem paga.

## Estrutura
- `backend/`: API REST, autenticação JWT, Prisma, rotas de exercícios, compras e admin.
- `frontend/`: app React Native com navegação, modo claro/escuro, compras PIX e tela admin.
- `web/`: versão web em React (Vite) com visual futurista azul/preto.

## Backend
1. Crie `.env` a partir de `backend/.env.example` e ajuste `DATABASE_URL`, `JWT_SECRET`, `PIX_KEY`.
2. Instale deps: `cd backend && npm install`.
3. Migrações: `npx prisma migrate dev --name init` (ou `npm run prisma:migrate`).
4. Gere client: `npm run prisma:generate`.
5. Seed (cria 34 exercícios gratuitos, 34 por linguagem, e admin `bernardoalmeida01031981@gmail.com` / `Bs01032012` com todas linguagens confirmadas): `npm run seed`.
6. Rodar: `npm run dev`.
7. Testes: `npm test`.

### Endpoints principais
- `POST /api/auth/register|login|forgot`
- `GET /api/exercises/free`
- `GET /api/exercises/language/:code` (JWT + compra confirmada)
- `POST /api/exercises/:id/submit` (salva run, XP e devolve certificado quando concluir 34)
- `POST /api/purchases/create` (gera QR PIX fictício)
- `POST /api/purchases/webhook` (stub de confirmação PIX via `txid`)
- `GET /api/purchases/mine`
- `GET /api/admin/users|purchases`, `POST /api/admin/language/:id/status` (apenas admin)

## Frontend
1. Instale deps: `cd frontend && npm install` (Expo).
2. Configure `EXPO_PUBLIC_API_URL` em `.env` ou via `app.config.js` para apontar para o backend.
3. Rodar: `npm start` (Expo), depois `i` ou `a` para iOS/Android.

## Web
1. `cd web && npm install`
2. Rodar: `npm run dev` (usa `VITE_API_URL` para o backend; padrão http://localhost:4000/api).

### Telas
- Login/Registro com sessão persistente.
- Início: exercícios gratuitos e status das linguagens (cadeado).
- Exercícios: editor simples, envio e progresso por linguagem.
- Compras: gera QR PIX, lista compras.
- Admin: ver usuários/compras, confirmar compra.

## Observações
- Integração PIX está em stub (gera string QR e webhook de confirmação). Substitua pelo provedor real e valide `txid/status`.
- Notificações diárias podem ser implementadas com Expo Notifications; aqui está apenas o esqueleto de tela e fluxo de estudo.

## Credenciais admin
- Email: `bernardoalmeida01031981@gmail.com`
- Senha: `Bs01032012`

Com essa conta todas as linguagens já vêm desbloqueadas (via seed).
