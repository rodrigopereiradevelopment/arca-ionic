const http = require("http");
const url = require("url");

const PORT = 3333;

const MERCADOS_MOCK = [
  { id: 1, nome: "Imperial", logo_url: null },
  { id: 2, nome: "Ponto Novo", logo_url: null },
  { id: 3, nome: "GoodBom", logo_url: null },
  { id: 4, nome: "Atacadão", logo_url: null },
  { id: 5, nome: "Pague Menos", logo_url: null },
  { id: 6, nome: "São Vicente", logo_url: null },
];

function gerarPayload(produtos) {
  return {
    sucesso: true,
    total_itens: produtos.length,
    mercados: MERCADOS_MOCK.map((m) => ({
      ...m,
      produtos: produtos.map((p) => ({
        nome_original: p.nome,
        produto_id: Math.floor(Math.random() * 50000) + 1,
        nome_encontrado: p.nome + " ENCONTRADO",
        preco: parseFloat((Math.random() * 30 + 2).toFixed(2)),
        quantidade: p.quantidade,
        similar: false,
        similarInfo: null,
      })),
      preco_total: parseFloat(
        (produtos.length * (Math.random() * 15 + 10)).toFixed(2)
      ),
      total_itens: produtos.length,
      itens_encontrados: produtos.length,
    })),
  };
}

async function handler(req, res) {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname;
  const cacheParam = parsed.query.cache === "true";

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && path === "/api/comparar") {
    let body = "";
    for await (const chunk of req) body += chunk;

    let produtos;
    try {
      produtos = JSON.parse(body).produtos;
    } catch {
      res.writeHead(400);
      res.end(JSON.stringify({ sucesso: false, erro: "JSON inválido" }));
      return;
    }

    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
      res.writeHead(400);
      res.end(JSON.stringify({ sucesso: false, erro: "Lista vazia" }));
      return;
    }

    // Simula latência realística
    if (cacheParam) {
      // Cache hit: Redis round-trip (~50ms)
      await new Promise((r) => setTimeout(r, 50 + Math.random() * 50));
    } else {
      // Cache miss: query real no Supabase (6-10s)
      const delay = 6000 + Math.random() * 4000;
      await new Promise((r) => setTimeout(r, delay));
    }

    const payload = gerarPayload(produtos);
    res.writeHead(200);
    res.end(JSON.stringify(payload));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ erro: "Rota não encontrada" }));
}

const server = http.createServer(handler);
server.listen(PORT, () => {
  console.log(`Mock server rodando em http://localhost:${PORT}`);
  console.log(`  POST /api/comparar?cache=true  → 50-100ms (Redis)`);
  console.log(`  POST /api/comparar?cache=false → 6-10s  (Supabase)`);
});
