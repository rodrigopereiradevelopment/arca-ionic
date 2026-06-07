# 🛒 ARCA Ionic — Comparador de Preços

[![Ionic](https://img.shields.io/badge/Ionic-8-blue?logo=ionic)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-20-red?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![App](https://img.shields.io/badge/App-Vercel-black?logo=vercel)](https://arca-ionic.vercel.app)
[![API](https://img.shields.io/badge/API-Vercel-black?logo=vercel)](https://arca-next.vercel.app)
![Version](https://img.shields.io/badge/version-1.0.4-green)
[![Lint](https://img.shields.io/badge/lint-passing-brightgreen)]()
[![Releases](https://img.shields.io/github/v/release/rodrigopereiradevelopment/arca-ionic)](https://github.com/rodrigopereiradevelopment/arca-ionic/releases)

**TCC — ETEC Pedro Ferreira Alves — Mogi Mirim/SP — 2025/2026**

App mobile para comparação de preços em supermercados. O usuário pesquisa produtos, monta sua lista de compras, gerencia o catálogo e descobre qual mercado oferece o menor preço total para a cesta completa.

> 🔗 **App:** [arca-ionic](https://github.com/rodrigopereiradevelopment/arca-ionic) — https://arca-ionic.vercel.app
> 🔗 **API Backend:** [arca-next](https://github.com/rodrigopereiradevelopment/arca-next) — https://arca-next.vercel.app
> 🕷️ **Scraper:** [arca-scraper](https://github.com/rodrigopereiradevelopment/arca-scraper)
> 📦 **Releases:** https://github.com/rodrigopereiradevelopment/arca-ionic/releases

---

## 🏗️ Arquitetura Completa

```
🕷️  arca-scraper (Python + GitHub Actions)
         ↓ 2x por semana
🗄️  MongoDB Atlas (~57.000 produtos — Bronze)
         ↓ ETL
🏺  Supabase PostgreSQL (Gold)
     ├── pg_trgm (busca fuzzy)
     ├── 6 mercados com coordenadas reais
     ├── histórico de preços
     ├── gestão de produtos, categorias e mercados
     ├── notificações (RLS)
     ├── atividades_recentes
     ├── tickets + mensagens
     └── alerta_preco (RLS)
         ↓
🚀  arca-next (Vercel — API)
     ├── /api/produtos
     ├── /api/produtos/precos
     ├── /api/produtos/search
     ├── /api/categorias
     ├── /api/mercados
     ├── /api/comparar (dinâmico — query Supabase)
     ├── /api/auth/*
     ├── /api/notificacoes
     ├── /api/historico
     ├── /api/tickets [+ mensagens]
     ├── /api/alertas
     ├── /api/upload
     ├── /api/configuracoes
     └── /api/chat (com contexto)
         ↓
📱  ESTE APP (Ionic + Angular)
```

---

## ✨ Funcionalidades

| Funcionalidade | Descrição | Status |
|----------------|-----------|--------|
| 🔍 **Busca fuzzy** | Encontra produtos mesmo com erros de digitação (pg_trgm) | ✅ |
| 🛒 **Carrinho** | Adiciona produtos com quantidade (+/-) | ✅ |
| 📊 **Lista Rápida** | Digite sua lista e compare automaticamente | ✅ |
| 🥇 **Ranking de mercados** | Mercados ordenados do mais barato ao mais caro | ✅ |
| 🏅 **Medalhas** | Ouro, prata e bronze para os 3 melhores | ✅ |
| 🗺️ **Mapa e rotas** | Localização real + rotas (Leaflet) — coordenadas da API | ✅ |
| 💾 **Persistência** | Carrinho salvo no localStorage | ✅ |
| 🤖 **Assistente IA** | Chat com Gemini — contexto das últimas 10 mensagens | ✅ |
| 👤 **Login/Cadastro** | Auth via Supabase OAuth + API customizada | ✅ |
| 🔔 **Alertas de preço** | Toggle ativar/desativar, deletar — dados reais da API | ✅ |
| 📦 **Gestão de Catálogo** | CRUD de produtos, categorias, upload de imagem | ✅ |
| 🏪 **Gestão de Mercados** | CRUD com geocoding Nominatim e controle de status | ✅ |
| 🎨 **Temas** | Modo escuro, alto contraste, fonte ajustável | ✅ |
| ♿ **Acessibilidade** | ARIA labels, `font-size` em `rem`, leitor de tela | ✅ |
| ⚙️ **Configurações** | Painel centralizado com persistência localStorage | ✅ |
| 🔔 **Notificações** | Reais via API — push/email/promoções, contagem não lidas | ✅ |
| 📜 **Histórico** | Híbrido (localStorage + API), auto-save em ações | ✅ |
| 🎫 **Tickets de Suporte** | Conversa ao vivo, marcar como resolvido | ✅ |
| 📸 **Upload de Imagem** | Webp via canvas, bucket `avatars`/`mercados` | ✅ |
| 🗑️ **Soft Delete** | Anonimização LGPD — dados preservados, conta desativada | ✅ |
| 📝 **Termos LGPD** | Controlador, consentimento granular, violação dados, foro CDC | ✅ |
| 🔒 **Privacidade LGPD** | Tabela 15+ dados, transferência internacional, 3os | ✅ |
| 💬 **FAQ + Chat** | Busca por termo, chat persistente em localStorage | ✅ |

---

## 🏪 Mercados Monitorados

| Mercado | Localização | Coordenadas |
|---------|------------|-------------|
| Imperial | R. Artur Juliani, 623 | -22.4383, -46.9327 |
| Ponto Novo | Av. Prof. Adib Chaib, 2750 | -22.4313, -46.9527 |
| GoodBom | Av. Pedro Botesi, 2800 | -22.4006, -46.9700 |
| Atacadão | Av. Pedro Botesi, 2855 | -22.4022, -46.9727 |
| Pague Menos | Av. Bandeirantes, 721 (Mogi Guaçu) | -22.3522, -46.9464 |
| São Vicente | R. Do Tucura, 105 | -22.4269, -46.9552 |

---

## 🔄 Fluxo do Usuário

```
1. Abre o app
2. Pesquisa "arroz 5kg" (busca fuzzy no Supabase)
3. Adiciona ao carrinho (quantidade: 2)
4. Repete para outros produtos
     — OU —
     Usa Lista Rápida: digita todos os produtos de uma vez
5. Clica em "Comparar Preços"
6. Vê ranking dos mercados com total da cesta
       🥇 Atacadão:   R$ 102,50
       🥈 GoodBom:    R$ 108,33
       🥉 PagueMenos: R$ 115,90
7. Escolhe o mercado e vê a rota no mapa

— Recursos Adicionais —
8. Recebe notificações de promoções e alertas de preço
9. Abre ticket de suporte com conversa ao vivo
10. Histórico automático de pesquisas e comparações
11. Altera foto do perfil (upload webp)
12. Ajusta fonte, tema escuro, alto contraste
```

---

## ⚙️ Configurações de Acessibilidade

Painel centralizado via `ConfigService` com persistência em localStorage e sync com API (`/api/configuracoes`):

| Configuração | Descrição |
|-------------|-----------|
| 🌙 **Modo escuro** | Tema escuro com classe `body.dark-theme` |
| 🎨 **Alto contraste** | `body.alto-contraste` com cores WCAG AA |
| 🔤 **Tamanho da fonte** | Pequeno (13px), Médio (16px), Grande (20px), Extra (24px) — via `--font-size-base` + `rem` |
| **B** **Texto negrito** | `body.texto-negrito` com `font-weight: 700` |
| 🎬 **Reduzir animações** | `body.reduzir-animacoes` com `transition: none` |
| ♿ **Modo leitor de tela** | `body.leitor-tela` com foco visível + `.sr-only` |

---



## ♿ Acessibilidade (ARIA)

Script automatizado que varre templates HTML adicionando:

- `aria-label` descritivos em botões com apenas emoji
- `aria-hidden="true"` em emojis decorativos
- `role="button" tabindex="0"` em elementos clicáveis não-nativos
- `aria-required="true"` em campos obrigatórios
- Todos os `font-size` em `rem` (escalam com configuração de acessibilidade)

---

## 🚀 Executar Localmente

```bash
git clone https://github.com/rodrigopereiradevelopment/arca-ionic.git
cd arca-ionic
npm install
ng serve
# http://localhost:4200
```

Crie `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://192.168.1.3:3000'
};
```

---

## 📁 Estrutura

```
arca-ionic/
├── src/app/
│   ├── pages/
│   │   ├── pesquisar-produtos/     # Busca fuzzy + categorias dinâmicas
│   │   ├── comparar/               # Ranking com medalhas + cache
│   │   ├── lista-rapida/           # Comparação por texto livre
│   │   ├── mapa-rotas/             # Leaflet — coordenadas da API
│   │   ├── mercados-proximos/      # Mapa dos 6 mercados
│   │   ├── login/                  # Autenticação
│   │   ├── cadastro/               # Registro de usuário
│   │   ├── gerenciar-produtos/     # CRUD produtos/categorias/preços
│   │   ├── gerenciar-mercados/     # CRUD mercados com status + upload
│   │   ├── gerenciar-usuarios/     # Admin — listar/editar usuários
│   │   ├── configuracoes/         # Configurações + acessibilidade
│   │   ├── perfil/                 # Perfil + endereços + alertas + foto
│   │   ├── historico/              # Histórico híbrido (local + API)
│   │   ├── notificacoes/           # Central de notificações reais
│   │   ├── tickets/                # Suporte com conversa ao vivo
│   │   ├── ajuda/                  # FAQ + chat Gemini com contexto
│   │   ├── privacidade/            # Política de privacidade (LGPD)
│   │   └── termos/                 # Termos de uso (LGPD)
│   ├── services/
│   │   ├── carrinho.service.ts     # Carrinho + localStorage
│   │   ├── comparacao.service.ts   # Seleção + localStorage
│   │   ├── auth.service.ts         # Auth via arca-next
│   │   ├── mercado.service.ts      # CRUD mercados
│   │   ├── produto.service.ts      # CRUD produtos + preços
│   │   ├── categoria.service.ts    # CRUD categorias
│   │   ├── config.service.ts       # Config centralizada + API sync
│   │   ├── notificacao.service.ts  # Notificações reais via API
│   │   ├── historico.service.ts    # Híbrido localStorage + API
│   │   └── ticket.service.ts       # Tickets + mensagens
│   └── components/
│       ├── modal-carrinho/         # Modal com +/- por produto
│       ├── menu/                   # Menu lateral
│       ├── header/                 # Cabeçalho fixo
│       └── footer/                 # Rodapé fixo
├── src/theme/
│   └── variables.scss              # CSS vars, dark-theme, alto-contraste
└── src/environments/
    ├── environment.ts              # Dev (IP fixo 192.168.1.3)
    └── environment.prod.ts         # Prod (Vercel)
```

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Ionic | 8 | Framework mobile (Standalone components) |
| Angular | 20 | Framework frontend (Lazy loading) |
| TypeScript | 5 | Linguagem |
| Leaflet | 1.9 | Mapas + rotas |
| Leaflet Routing Machine | 3.2 | Rotas entre mercados |
| Supabase JS | 2 | Auth client |
| Google Gemini | — | Assistente IA (chat com contexto) |
| Karma + Jasmine | — | Testes unitários |

---

## 📊 Destaques Técnicos

- **Busca fuzzy** com `pg_trgm` — encontra "acucar" mesmo digitando "açúcar"
- **Comparação paralela** com `Promise.all` — mercados em paralelo
- **`ionViewWillEnter`** em vez de `ngOnInit` — evita cache do Ionic
- **Standalone components** — sem NgModules, lazy loading em todas as rotas
- **HashLocationStrategy** — URLs com `#` (compatível com Cordova/Capacitor)
- **BehaviorSubject + localStorage** — estado sem NgRx/Signals
- **ConfigService centralizado** — tema, fonte, acessibilidade + sync API
- **Histórico híbrido** — localStorage instantâneo + merge com API
- **Notificações reais** — RLS no Supabase, cada usuário vê só as suas
- **Tickets normalizados** — 2 tabelas (ticket + mensagens) em vez de JSONB
- **Upload webp** — canvas client-side + bucket dinâmico
- **Soft delete LGPD** — anonimização preserva integridade relacional
- **CSS variables + `rem`** — `--font-size-base` escala todo o app
- **Lint zero erros** — `@angular-eslint/prefer-inject`, sem `ngOnInit` vazios
- **Gemini com contexto** — últimas 10 mensagens enviadas como `parts`
- **Cache comparar** — hash dos produtos + TTL 30min em localStorage
- **Docs legais sem CMS** — Termos + Privacidade como páginas Ionic standalone

---

## 👨‍🎓 Equipe

| Nome | Papel |
|------|-------|
| Rodrigo Pereira | Desenvolvedor Full Stack |
| Bruno | Colaborador |
| Miguel | Colaborador |
| Félix | Colaborador |

**Orientador:** Prof. Maurício Aparecido das Neves
**Coordenadora:** Prof.ª Simone Andreia de Campos Camargo
📍 ETEC Pedro Ferreira Alves — Mogi Mirim/SP

📝 **Licença:** MIT © ARCA 2025/2026
