# 🛒 ARCA Ionic — Comparador de Preços

[![Ionic](https://img.shields.io/badge/Ionic-8-blue?logo=ionic)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-20-red?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/API-Vercel-black?logo=vercel)](https://arca-next.vercel.app)

**TCC — ETEC Pedro Ferreira Alves — Mogi Mirim/SP — 2025/2026**

App mobile para comparação de preços em supermercados. O usuário pesquisa produtos, monta sua lista de compras e descobre qual mercado oferece o menor preço total para a cesta completa.

> 🔗 **API Backend:** [arca-next](https://github.com/rodrigopereiradevelopment/arca-next) — https://arca-next.vercel.app  
> 🕷️ **Scraper:** [arca-scraper](https://github.com/rodrigopereiradevelopment/arca-scraper)

---

## 🏗️ Arquitetura Completa

```
🕷️  arca-scraper (Python + GitHub Actions)
         ↓ 2x por semana
🗄️  MongoDB Atlas (53.633 produtos — Bronze)
         ↓ ETL
🏺  Supabase PostgreSQL (Gold)
     ├── pg_trgm (busca fuzzy)
     ├── 6 mercados com coordenadas reais
     └── histórico de preços
         ↓
🚀  arca-next (Vercel — API)
     ├── /api/produtos/search
     ├── /api/produtos/preco
     ├── /api/produtos/preco-similar
     └── /api/auth/*
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
| 👤 **Login/Cadastro** | Autenticação via Supabase Auth | ✅ |
| 🔔 **Alertas de preço** | Notificação quando preço cai | ⏳ |

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

## 🚀 Executar Localmente

```bash
git clone https://github.com/rodrigopereiradevelopment/arca-ionic.git
cd arca-ionic
npm install
ionic serve
# http://localhost:8100
```

Crie `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000' // ou https://arca-next.vercel.app
};
```

---

## 📁 Estrutura

```
arca-ionic/
├── src/app/
│   ├── pages/
│   │   ├── pesquisar-produtos/   # Busca com fuzzy match
│   │   ├── comparar/             # Ranking com medalhas
│   │   ├── lista-rapida/         # Comparação por texto livre
│   │   ├── mapa-rotas/           # Leaflet + rotas reais
│   │   ├── mercados-proximos/    # Mapa dos 6 mercados
│   │   ├── login/                # Autenticação
│   │   └── cadastro/             # Registro de usuário
│   ├── services/
│   │   ├── carrinho.service.ts   # Carrinho + localStorage
│   │   ├── comparacao.service.ts # Seleção + localStorage
│   │   └── auth.service.ts       # Auth via arca-next
│   └── components/
│       ├── modal-carrinho/       # Modal com +/- por produto
│       ├── menu/                 # Menu lateral
│       └── footer/               # Rodapé fixo
└── src/environments/
    ├── environment.ts            # Dev (localhost)
    └── environment.prod.ts       # Prod (Vercel)
```

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Ionic | 8 | Framework mobile |
| Angular | 20 | Framework frontend |
| TypeScript | 5 | Linguagem |
| Leaflet | 1.9 | Mapas |
| Leaflet Routing Machine | 3.2 | Rotas entre mercados |
| Supabase JS | 2 | Auth client |

---

## 📊 Destaques Técnicos

- **Busca fuzzy** com `pg_trgm` — encontra "acucar" mesmo digitando "açúcar"
- **Comparação paralela** com `Promise.all` — 6 mercados em ~4s em vez de ~72s
- **`ionViewWillEnter`** em vez de `ngOnInit` — evita cache do Ionic
- **localStorage** — carrinho e comparação persistem entre sessões
- **Fallback por similaridade** — se não achar pelo ID, busca pelo nome
- **Coordenadas reais** de todos os mercados via Google Places API

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
