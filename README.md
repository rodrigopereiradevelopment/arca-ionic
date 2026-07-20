# 🛒 ARCA — Comparador de Preços para Supermercados Locais

[![Ionic](https://img.shields.io/badge/Ionic-8-blue?logo=ionic)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-20-red?logo=angular)](https://angular.io/)
![Version](https://img.shields.io/badge/version-1.2.2-green)
[![Releases](https://img.shields.io/github/v/release/rodrigopereiradevelopment/arca-ionic)](https://github.com/rodrigopereiradevelopment/arca-ionic/releases)

**TCC — ETEC Pedro Ferreira Alves — Mogi Mirim/SP — 2025/2026**

ARCA conecta consumidores a supermercados parceiros com preços atualizados. Mercados cadastram seus próprios produtos via portal B2B. Usuários também podem contribuir escaneando notas fiscais (NF-e).

> **Status:** MVP em validação. Base de demonstração em transição para cadastro via portal B2B + NF-e.

> 🔗 **App:** https://arca-ionic.vercel.app
> 🔗 **API:** https://arca-next.vercel.app

---

## 🔄 Como Funciona

```
1. Abre o app
2. Pesquisa "arroz 5kg" (busca tsvector + fallback ILIKE)
3. Adiciona ao carrinho
4. Repete para outros produtos
5. Clica em "Comparar Preços"
6. Vê ranking dos mercados com total da cesta
7. Escolhe o mercado e vê a rota no mapa
```

---

## ⚡ Performance

| Processo | Antes | Hoje | Ganho |
|----------|-------|------|-------|
| Busca de produtos | 4.1s | **0.36s** | 11× |
| Comparação (20 produtos) | 8s | **0.34s** | 23× |

---

## 🚀 Executar Localmente

```bash
git clone https://github.com/rodrigopereiradevelopment/arca-ionic.git
cd arca-ionic
npm install
ng serve
# http://localhost:4200
```

---

## 📦 Gerar APK

```bash
npx ng build --configuration production
cd android && ./gradlew assembleDebug
```

---

## Equipe

| Nome | Papel |
|------|-------|
| Rodrigo Pereira | Desenvolvedor Full Stack |
| Bruno Henrique Oliveira Capra | Desenvolvedor |
| Miguel da Silva Bernades | Desenvolvedor |
| Felix Renato Marques Junior | Desenvolvedor |

**Orientador:** Prof. Maurício Aparecido das Neves
**Coordenadora:** Prof.ª Simone Andreia de Campos Camargo
📍 ETEC Pedro Ferreira Alves — Mogi Mirim/SP

📝 **Licença:** MIT
