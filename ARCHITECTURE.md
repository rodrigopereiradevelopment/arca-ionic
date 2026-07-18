# arca-ionic — Arquitetura Técnica

## Estrutura

```
arca-ionic/
├── src/app/
│   ├── pages/              # 25+ páginas standalone
│   ├── services/           # 15+ serviços
│   └── components/         # modais, menu, header, footer
├── src/theme/
│   └── variables.scss      # CSS vars, dark-theme, alto-contraste
└── src/environments/
    ├── environment.ts      # Dev (IP fixo 192.168.1.3)
    └── environment.prod.ts # Prod (Vercel)
```

## Decisões Técnicas

| Decisão | Motivo |
|---------|--------|
| **Standalone components** | Sem NgModules, lazy loading em todas as rotas |
| **HashLocationStrategy** | URLs com `#` (compatível com Cordova/Capacitor) |
| **ionViewWillEnter** | Evita cache do Ionic (ngOnInit não re-executa) |
| **BehaviorSubject + localStorage** | Estado sem NgRx/Signals |
| **ConfigService centralizado** | Tema, fonte, acessibilidade + sync API |

## Páginas

| Página | Função |
|--------|--------|
| `pesquisar-produtos/` | Busca fuzzy + categorias dinâmicas + paginação |
| `comparar/` | Ranking com medalhas + cache |
| `lista-rapida/` | Comparação por texto livre |
| `mapa-rotas/` | Leaflet — coordenadas da API |
| `mercados-proximos/` | Mapa dos 6 mercados |
| `login/` | Autenticação |
| `cadastro/` | Registro de usuário |
| `onboarding/` | 5 slides swipeable (Swiper.js) |
| `esqueci-senha/` | Recuperação de senha |
| `redefinir-senha/` | Redefinição com token |
| `gerenciar-produtos/` | CRUD produtos/categorias/preços |
| `gerenciar-mercados/` | CRUD mercados com status + upload |
| `gerenciar-usuarios/` | Admin — listar/editar usuários |
| `gerenciar-denuncias/` | Admin — moderar denúncias |
| `configuracoes/` | Configurações + acessibilidade |
| `perfil/` | Perfil + endereços + alertas + foto |
| `historico/` | Histórico híbrido (local + API) |
| `notificacoes/` | Central de notificações reais |
| `cupons/` | Cupons de desconto |
| `tickets/` | Suporte com conversa ao vivo |
| `ajuda/` | FAQ + chat Gemini com contexto |
| `privacidade/` | Política de privacidade (LGPD) |
| `termos/` | Termos de uso (LGPD) |

## Services

| Service | Função |
|---------|--------|
| `carrinho.service.ts` | Carrinho + localStorage |
| `comparacao.service.ts` | Seleção + localStorage |
| `auth.service.ts` | Auth via arca-next |
| `mercado.service.ts` | CRUD mercados |
| `produto.service.ts` | CRUD produtos + preços |
| `categoria.service.ts` | CRUD categorias |
| `config.service.ts` | Config centralizada + API sync |
| `notificacao.service.ts` | Notificações reais via API |
| `historico.service.ts` | Híbrido localStorage + API |
| `ticket.service.ts` | Tickets + mensagens |
| `cupom.service.ts` | Cupons de desconto |
| `favorito.service.ts` | Favoritos |
| `denuncia.service.ts` | Denúncias |
| `info-nutricional.service.ts` | Info nutricional + Open Food Facts |
| `audio.service.ts` | HTMLAudioElement (5 sons) |
| `avaliacao.service.ts` | Avaliação de mercados |
| `push-notification.service.ts` | FCM push notifications |
| `update.service.ts` | In-app update check |

## Componentes

| Componente | Função |
|------------|--------|
| `modal-carrinho/` | Modal com +/- por produto |
| `modal-produto/` | Modal detalhes + info nutricional |
| `menu/` | Menu lateral |
| `header/` | Cabeçalho fixo |
| `footer/` | Rodapé fixo |

## Configurações de Acessibilidade

Painel centralizado via `ConfigService` com persistência em localStorage e sync com API (`/api/configuracoes`):

| Configuração | Descrição |
|-------------|-----------|
| 🌙 **Modo escuro** | Tema escuro com classe `body.dark-theme` |
| 🎨 **Alto contraste** | `body.alto-contraste` com cores WCAG AA |
| 🔤 **Tamanho da fonte** | Pequeno (14px), Médio (16px), Grande (22px), Extra (28px) — via `--font-size-base` + `rem` |
| **B** **Texto negrito** | `body.texto-negrito` com `font-weight: 700` |
| 🎬 **Reduzir animações** | `body.reduzir-animacoes` com `transition: none` |
| ♿ **Modo leitor de tela** | `body.leitor-tela` com foco visível + `.sr-only` |

## Acessibilidade (ARIA)

Script automatizado que varre templates HTML adicionando:

- `aria-label` descritivos em botões com apenas emoji
- `aria-hidden="true"` em emojis decorativos
- `role="button" tabindex="0"` em elementos clicáveis não-nativos
- `aria-required="true"` em campos obrigatórios
- Todos os `font-size` em `rem` (escalam com configuração de acessibilidade)

## Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Ionic | 8 | Framework mobile (Standalone components) |
| Angular | 20 | Framework frontend (Lazy loading) |
| TypeScript | 5 | Linguagem |
| Capacitor | 8 | Ponte nativa (APK Android) |
| @capacitor/camera | 8 | Captura de foto perfil |
| @capacitor/push-notifications | 8 | Push FCM |
| @capacitor/status-bar | 8 | Status bar escura (Style.Dark) |
| @capacitor/haptics | 8 | Feedback tátil |
| @capacitor/keyboard | 8 | Keyboard overlay imersivo |
| Leaflet | 1.9 | Mapas + rotas |
| Leaflet Routing Machine | 3.2 | Rotas entre mercados |
| Swiper.js | 12 | Onboarding swipeable |
| Supabase JS | 2 | Auth client |
| Google Gemini | — | Assistente IA (chat com contexto) |
| Firebase Cloud Messaging | — | Push notifications |
| Resend | — | E-mail recuperação senha |
| Open Food Facts | — | Info nutricional (Nutri-Score) |
| Nominatim | — | Geocoding mercados |
| ViaCEP | — | Busca CEP automática |
| Karma + Jasmine | — | Testes unitários |

## Destaques Técnicos

- **Busca fuzzy** com `pg_trgm` — encontra "acucar" mesmo digitando "açúcar"
- **Comparação paralela** com `Promise.all` — mercados em paralelo
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
- **Gemini com contexto** — últimas 10 mensagens enviadas como `parts`
- **Cache comparar** — hash dos produtos + TTL 30min em localStorage
- **Fetch one extra** — `limit+1` em vez de `count: "exact"` para evitar timeout
- **Parallelização Promise.all** — 40–60% mais rápido em gerenciar-produtos, perfil, app.component
- **Safe-area headers/footer** — `padding-top: var(--ion-safe-area-top)`, `env(safe-area-inset-bottom)`
- **In-app update** — `CapacitorHttp` + `@capacitor/filesystem` + `@capacitor-community/file-opener`
- **Portal do Mercado (B2B)** — `lib/mercado-auth.ts`, dashboard, CRUD preços, import CSV
- **Role mercado_admin** — `profiles.mercado_id` FK → `supermercados.id`, RLS no backend
- **Busca por similares** — fallback automático com trigram + categoria + peso + preço
- **Filtro âncora substitutos** — blocklists por âncora, zero falsos positivos
- **Comparação chunked** — CHUNK_SIZE=20, CONCORRENCIA=3, merge progressivo
- **Busca paralela** — Lista Rápida em batches de 10, barra de progresso
- **Filtro por mercado** — `supermercado_id` na API de search + chips horizontais
