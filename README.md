# 🛒 ARCA — O App que te mostra onde a comida é mais barata

[![Ionic](https://img.shields.io/badge/Ionic-8-blue?logo=ionic)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-20-red?logo=angular)](https://angular.io/)
![Version](https://img.shields.io/badge/version-1.2.2-green)
[![Releases](https://img.shields.io/github/v/release/rodrigopereiradevelopment/arca-ionic)](https://github.com/rodrigopereiradevelopment/arca-ionic/releases)

**TCC — ETEC Pedro Ferreira Alves — Mogi Mirim/SP — 2025/2026**

ARCA é uma plataforma de comparação inteligente de preços para supermercados. O sistema monitora milhares de produtos de diferentes mercados, permitindo montar listas de compras e descobrir automaticamente onde a cesta completa sai mais barata.

```
📱 58.000+ produtos · 6 supermercados · Android + Web
```

> 🔗 **App:** https://arca-ionic.vercel.app
> 🔗 **API:** https://arca-next.vercel.app

---

## 🏗️ Arquitetura

```
🕷️  arca-scraper (Python) — coleta preços 2×/semana
🗄️  MongoDB Atlas (Bronze) → Supabase PostgreSQL (Gold)
🚀  arca-next (Vercel) — API Next.js com Redis cache
📱  arca-ionic (Ionic 8 + Angular 20) — Android + Web
```

---

## ⚡ Performance

| Processo | Antes | Hoje | Ganho |
|----------|-------|------|-------|
| Busca de produtos | 4.1s | **0.36s** | 11× |
| Comparação (20 produtos) | 8s | **0.34s** | 23× |
| Sincronização scraper | ~27 min | **~2 min** | 13× |

---

## 🔄 Como Funciona

```
1. Abre o app
2. Pesquisa "arroz 5kg" (busca fuzzy + tsvector)
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
```

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

## 📦 Gerar APK

```bash
# Build do APK
npx ng build --configuration production
cd android && ./gradlew assembleDebug

# Sync Capacitor
npx cap sync android

# APK gerado em:
# android/app/build/outputs/apk/debug/arca-vX.Y.Z.apk
```

Upload pro GitHub Release:

```bash
gh release create vX.Y.Z \
  android/app/build/outputs/apk/debug/arca-vX.Y.Z.apk \
  --title "vX.Y.Z — descrição" \
  --notes "Release notes"
```

---

## 🏪 Mercados Monitorados

| Mercado | Localização |
|---------|------------|
| Imperial | R. Artur Juliani, 623 |
| Ponto Novo | Av. Prof. Adib Chaib, 2750 |
| GoodBom | Av. Pedro Botesi, 2800 |
| Atacadão | Av. Pedro Botesi, 2855 |
| Pague Menos | Av. Bandeirantes, 721 (Mogi Guaçu) |
| São Vicente | R. Do Tucura, 105 |

---

## 👨‍🎓 Equipe

| Nome | Papel |
|------|-------|
| Rodrigo Pereira | Desenvolvedor Full Stack |
| Bruno Henrique Oliveira Capra | Desenvolvedor |
| Miguel da Silva Bernades | Desenvolvedor |
| Felix Renato Marques Junior | Desenvolvedor |

**Orientador:** Prof. Maurício Aparecido das Neves
**Coordenadora:** Prof.ª Simone Andreia de Campos Camargo
📍 ETEC Pedro Ferreira Alves — Mogi Mirim/SP

📝 **Licença:** MIT © ARCA 2025/2026
