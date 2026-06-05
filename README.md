# 🛒 ARCA Ionic — Comparador de Preços

[![Ionic](https://img.shields.io/badge/Ionic-8-blue?logo=ionic)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-20-red?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/API-Vercel-black?logo=vercel)](https://arca-next.vercel.app)
![Version](https://img.shields.io/badge/version-1.0.2-green)

**TCC — ETEC Pedro Ferreira Alves — Mogi Mirim/SP — 2025/2026**

App mobile para comparação de preços em supermercados. O usuário pesquisa produtos, monta sua lista de compras, gerencia o catálogo e descobre qual mercado oferece o menor preço total para a cesta completa.

> 🔗 **API Backend:** [arca-next](https://github.com/rodrigopereiradevelopment/arca-next) — https://arca-next.vercel.app
> 🕷️ **Scraper:** [arca-scraper](https://github.com/rodrigopereiradevelopment/arca-scraper)

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
     └── gestão de produtos, categorias e mercados
         ↓
🚀  arca-next (Vercel — API)
     ├── /api/produtos (CRUD + paginação + busca)
     ├── /api/produtos/precos
     ├── /api/produtos/search
     ├── /api/categorias (CRUD)
     ├── /api/mercados (CRUD + geocoding)
     ├── /api/auth/*
     └── /api/chat
         ↓
📱  ESTE APP (Ionic + Angular)
```

---

## ✨ Funcionalidades

| Funcionalidade | Descrição | Status |
|----------------|-----------|--------|
| 🔍 **Busca fuzzy** | Encontra produtos mesmo com erros de digitação | ✅ |
| 🛒 **Carrinho** | Adiciona produtos com quantidade (+/-) | ✅ |
| 📊 **Lista Rápida** | Digite sua lista e compare automaticamente | ✅ |
| 🥇 **Ranking de mercados** | 6 mercados ordenados do mais barato ao mais caro | ✅ |
| 🏅 **Medalhas** | Ouro, prata e bronze para os 3 melhores | ✅ |
| 🗺️ **Mapa e rotas** | Localização real dos mercados + rotas (Leaflet) | ✅ |
| 💾 **Persistência** | Carrinho salvo no localStorage | ✅ |
| 🤖 **Assistente IA** | Chat com Google Gemini | ✅ |
| 👤 **Login/Cadastro** | Autenticação via Supabase OAuth + API | ✅ |
| 🔔 **Alertas de preço** | Notificação quando preço cai | ⏳ |
| 📦 **Gestão de Catálogo** | CRUD de produtos, categorias, upload de imagem | ✅ |
| 🏪 **Gestão de Mercados** | CRUD com geocoding e controle de status | ✅ |
| 🎨 **Temas** | Modo escuro, alto contraste, fonte ajustável | ✅ |
| ♿ **Acessibilidade** | ARIA labels, alto contraste, leitor de tela | ✅ |
| ⚙️ **Configurações** | Painel centralizado com persistência localStorage | ✅ |

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
6. Vê ranking dos 6 mercados com total da cesta
       🥇 Atacadão:   R$ 102,50
       🥈 GoodBom:    R$ 108,33
       🥉 PagueMenos: R$ 115,90
7. Escolhe o mercado e vê a rota no mapa
```

---

## ⚙️ Configurações de Acessibilidade

Painel centralizado via `ConfigService` com persistência em localStorage:

| Configuração | Descrição |
|-------------|-----------|
| 🌙 **Modo escuro** | Tema escuro com classe `body.dark-theme` |
| 🎨 **Alto contraste** | `body.alto-contraste` com cores de alto contraste |
| 🔤 **Tamanho da fonte** | Normal, Grande (`--font-size-base: 18px`), Gigante (`20px`) |
| **B** **Texto negrito** | `body.texto-negrito` com `font-weight: 700` |
| 🎬 **Reduzir animações** | `body.reduzir-animacoes` com `transition: none` |
| ♿ **Modo leitor de tela** | `body.leitor-tela` com foco visível + `.sr-only` |

Todas as configurações são aplicadas via classes no `<body>` e CSS vars dinâmicas (`--font-size-base`, `--font-weight-base`, `--line-height-base`). O tema escuro usa `variables.scss` com fallback para Ionic Dark System CSS.

---

## ♿ Acessibilidade (ARIA)

Script automatizado que varre 18 templates HTML adicionando:

- `aria-label` descritivos em botões com apenas emoji (Editar, Excluir, Fechar, etc.)
- `aria-hidden="true"` em emojis decorativos em headings e labels
- `role="button" tabindex="0"` em elementos clicáveis não-nativos
- `aria-required="true"` em campos obrigatórios de formulários

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
│   │   ├── pesquisar-produtos/     # Busca com fuzzy match
│   │   ├── comparar/               # Ranking com medalhas
│   │   ├── lista-rapida/           # Comparação por texto livre
│   │   ├── mapa-rotas/             # Leaflet + rotas reais
│   │   ├── mercados-proximos/      # Mapa dos 6 mercados
│   │   ├── login/                  # Autenticação
│   │   ├── cadastro/               # Registro de usuário
│   │   ├── gerenciar-produtos/     # CRUD produtos/categorias/preços
│   │   ├── gerenciar-mercados/     # CRUD mercados com status
│   │   ├── configuracoes/          # Configurações + acessibilidade
│   │   ├── perfil/                 # Perfil do usuário
│   │   ├── historico/              # Histórico de comparações
│   │   ├── notificacoes/           # Central de notificações
│   │   ├── ticket/                 # Suporte
│   │   ├── ajuda/                  # FAQ
│   │   ├── privacidade/            # Política de privacidade
│   │   └── termos/                 # Termos de uso
│   ├── services/
│   │   ├── carrinho.service.ts     # Carrinho + localStorage
│   │   ├── comparacao.service.ts   # Seleção + localStorage
│   │   ├── auth.service.ts         # Auth via arca-next
│   │   ├── mercado.service.ts      # CRUD mercados
│   │   ├── produto.service.ts      # CRUD produtos + preços
│   │   ├── categoria.service.ts    # CRUD categorias
│   │   └── config.service.ts       # Config centralizada + localStorage
│   └── components/
│       ├── modal-carrinho/         # Modal com +/- por produto
│       ├── menu/                   # Menu lateral
│       ├── header/                 # Cabeçalho fixo
│       └── footer/                 # Rodapé fixo
├── src/theme/
│   └── variables.scss              # 123 vars CSS, dark-theme, alto-contraste
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
| Leaflet | 1.9 | Mapas |
| Leaflet Routing Machine | 3.2 | Rotas entre mercados |
| Supabase JS | 2 | Auth client |
| Karma + Jasmine | — | Testes unitários |

---

## 📊 Destaques Técnicos

- **Busca fuzzy** com `pg_trgm` — encontra "acucar" mesmo digitando "açúcar"
- **Comparação paralela** com `Promise.all` — 6 mercados em ~4s em vez de ~72s
- **`ionViewWillEnter`** em vez de `ngOnInit` — evita cache do Ionic
- **Standalone components** — sem NgModules, lazy loading em todas as rotas
- **HashLocationStrategy** — URLs com `#` (compatível com Cordova/Capacitor)
- **BehaviorSubject + localStorage** — estado sem NgRx/Signals
- **ConfigService centralizado** — tema, fonte, acessibilidade em um só lugar
- **CSS variables** — `var(--arca-*)` com suporte a dark-theme e alto-contraste
- **ARIA attributes** — acessibilidade em 18 templates HTML

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
