# arca-ionic — Changelog

## v1.2.2 (15/jul/2026)
- tsvector full-text search (busca 4.1s → 0.36s)
- Redis Cache no backend (comparação 8s → 0.34s)
- Security fixes (REVOKE EXECUTE anon, SET search_path public)
- RLS performance (auth.uid() em subquery)
- Limpeza preços: 790k → 59k linhas (145MB → 15MB)

## v1.2.1 (03/jul/2026)
- Comparação chunked — listas de qualquer tamanho, chunks de 20, 3 paralelos
- Busca paralela — Lista Rápida em batches de 10
- Filtro por mercado — chips horizontais na busca
- In-app update — CapacitorHttp + Filesystem + FileOpener
- Portal do Mercado (B2B) — dashboard, gerenciar produtos, importar CSV
- Imagens com onerror silencioso

## v1.2.0 (29/jun/2026)
- Sincronização refatorada — 3 fases batch + RPC (~2 min)
- Produtos equivalentes — 700k pares
- Busca por similares — fallback com trigram + categoria + peso
- Filtro âncora substitutos — blocklists, zero falsos positivos
- Ordenação por completeza — mercados com mais itens primeiro

## v1.1.9 (22/jun/2026)
- Portal do Mercado — migration, APIs, páginas B2B
- Role mercado_admin
- Índice EAN

## v1.1.8 (14/jun/2026)
- Índices de performance
- Colunas profiles para mercado vinculado

## v1.1.7 (07/jun/2026)
- Cupons de desconto
- Favoritos
- Denúncias
- Device tokens (FCM)
- Recovery tokens (Resend)

## v1.1.6 (05/jun/2026)
- Histórico de listas
- Notificações reais
- Alertas de preço

## v1.1.5 (04/jun/2026)
- Gestão de mercados — CRUD com geocoding
- Gestão de produtos — CRUD com categorias

## v1.1.0 (31/mai/2026)
- Gestão de mercados — migration com logo_url, email, cidade, CEP
- Status de mercados — aprovado/pendente/desativado

## v1.0.0 (29/mar/2026)
- Schema completo — produtos, preços, supermercados, usuários
- Auth — Supabase OAuth + API customizada
- Comparação — ranking de mercados com medalhas
- Mapa e rotas — Leaflet
- Acessibilidade — modo escuro, alto contraste, fonte ajustável

---

## Funcionalidades

### Core
- Busca fuzzy (pg_trgm)
- Comparação de preços (4 camadas de fallback)
- Lista Rápida (busca paralela)
- Ranking de mercados com medalhas
- Mapa e rotas (Leaflet)
- Comparação chunked (listas grandes)
- Filtro por mercado na busca

### B2B
- Portal do Mercado (dashboard, CRUD, CSV)
- Role mercado_admin
- Índice EAN

### Performance
- tsvector full-text search
- Redis cache (Upstash)
- Comparação chunked
- Scraper 3 fases batch
- Promise.all paralelo
- Fetch one extra (sem count)

### Segurança
- RLS em todas as tabelas
- SECURITY DEFINER com search_path fixo
- anon sem EXECUTE
- LGPD (soft delete, termos, privacidade)

### UX
- In-app update
- Push notifications (FCM)
- Notificações reais
- Cupons de desconto
- Favoritos
- Denúncias
- Info nutricional (Nutri-Score)
- Efeitos sonoros e vibração
- Onboarding (5 slides)
- Tema escuro e alto contraste
- Fonte ajustável
- Modo leitor de tela

### Admin
- Gestão de produtos (CRUD)
- Gestão de mercados (CRUD + geocoding)
- Gestão de usuários
- Moderação de denúncias
- Tickets de suporte

### LGPD
- Soft delete (anonimização)
- Termos de uso
- Política de privacidade
- Consentimento granular
