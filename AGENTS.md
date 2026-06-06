# arca-ionic — App Mobile

```bash
ng serve                  # Dev em http://localhost:4200
ng test                   # Testes unitários (Karma + Jasmine)
ng lint                   # ESLint
```

- **Standalone components** (sem NgModules), lazy loading em todas as rotas
- **HashLocationStrategy** — URLs com `#`
- **Estado**: `BehaviorSubject` + `localStorage` (sem NgRx/Signals)
- **Ciclo de vida**: usar `ionViewWillEnter` em vez de `ngOnInit` (evita cache do Ionic)
- `environment.ts` aponta para `http://192.168.1.3:3000` (IP fixo, não localhost)
- **IDs de mercados** (hardcoded): `1=GoodBom`, `2=PagueMenos`, `3=SaoVicente`, `4=Atacadao`, `5=Imperial`, `6=PontoNovo`
- **Páginas de mercado usam dados mockados** — `/gerenciar-mercados`, `/cadastrar-mercado`, `/mercados-proximos` não têm API; dados fictícios em memória
- **Auth**: Supabase OAuth (Google/Facebook) + API customizada. Token em `localStorage` chave `arca_usuario`
- **Rotas duplicadas**: `configuracoes`, `ajuda`, `perfil` aparecem 2x em `app.routes.ts` — a 2ª sem `canActivate`, tornando-as públicas
- Sem `@supabase/supabase-js` instalado — Supabase usado só para redirect OAuth

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **meu-app-ionic** (3244 symbols, 8266 relationships, 273 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/meu-app-ionic/context` | Codebase overview, check index freshness |
| `gitnexus://repo/meu-app-ionic/clusters` | All functional areas |
| `gitnexus://repo/meu-app-ionic/processes` | All execution flows |
| `gitnexus://repo/meu-app-ionic/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
