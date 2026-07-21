import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate, Trend } from "k6/metrics";

const USE_CACHE = __ENV.USE_CACHE === "true";
const BASE = USE_CACHE ? "http://localhost:3333?cache=true" : "http://localhost:3333?cache=false";
const TAG = USE_CACHE ? "com_cache" : "sem_cache";

const falhas = new Rate("requisicoes_falhas");
const tempoComparacao = new Trend("tempo_comparacao_ms");

const LISTA_COMPRAS = [
  { nome: "ARROZ CAMIL", quantidade: 1 },
  { nome: "FEIJAO CARIOCA", quantidade: 2 },
  { nome: "OLEO SOJA", quantidade: 1 },
  { nome: "ACUCAR CRISTAL", quantidade: 1 },
  { nome: "CAFE PILAO", quantidade: 1 },
  { nome: "LEITE INTEGRAL", quantidade: 3 },
  { nome: "SABAO PO", quantidade: 1 },
  { nome: "DETERGENTE LIQUIDO", quantidade: 2 },
  { nome: "PAPEL HIGIENICO", quantidade: 4 },
  { nome: "MACARRAO SPAGHETTI", quantidade: 2 },
  { nome: "FARINHA TRIGO", quantidade: 1 },
  { nome: "BISCOITO RECHEADO", quantidade: 3 },
  { nome: "REFRIGERANTE COLA", quantidade: 2 },
  { nome: "AGUA MINERAL", quantidade: 6 },
  { nome: "CARNE MOIDA", quantidade: 2 },
];

const LISTA_GRANDE = [
  ...LISTA_COMPRAS,
  { nome: "FRANGO CONGELADO", quantidade: 1 },
  { nome: "OVOS BRANCOS", quantidade: 2 },
  { nome: "MANTEIGA COM SAL", quantidade: 1 },
  { nome: "QUEIJO MUSSARELA", quantidade: 1 },
  { nome: "ABACATE", quantidade: 1 },
];

const METRIC_CONFIG = {
  thresholds: {
    [`tempo_comparacao_ms`]: ["avg<1000", "p(95)<2000"],
    http_req_failed: ["rate<0.05"],
  },
};

// Cenário leve: usa BASE URL + suffix
function urlBase(path) {
  if (USE_CACHE) return `http://localhost:3333/api/comparar?cache=true`;
  return `http://localhost:3333/api/comparar?cache=false`;
}

export const options = {
  thresholds: METRIC_CONFIG.thresholds,
  scenarios: {
    comparacao_15_itens: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "20s", target: 5 },
        { duration: "20s", target: 5 },
        { duration: "10s", target: 0 },
      ],
      exec: "comparacao15",
      tags: { cenario: `comparacao_15_itens_${TAG}` },
    },
    comparacao_20_itens: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "20s", target: 3 },
        { duration: "20s", target: 3 },
        { duration: "10s", target: 0 },
      ],
      exec: "comparacao20",
      tags: { cenario: `comparacao_20_itens_${TAG}` },
    },
  },
};

function fazerComparacao(produtos, nomeCenario) {
  group(`Comparacao ${produtos.length} itens [${TAG}]`, () => {
    const res = http.post(urlBase("/api/comparar"), JSON.stringify({ produtos }), {
      headers: { "Content-Type": "application/json" },
      timeout: "30s",
      tags: { tipo: nomeCenario },
    });
    tempoComparacao.add(res.timings.duration);
    falhas.add(!(res.status >= 200 && res.status < 400));
    check(res, {
      "status 200": (r) => r.status === 200,
      [`tempo < ${USE_CACHE ? "200ms" : "10s"}`]: (r) =>
        USE_CACHE ? r.timings.duration < 200 : r.timings.duration < 10000,
      "sucesso true": (r) => {
        try {
          return JSON.parse(r.body).sucesso === true;
        } catch {
          return false;
        }
      },
      "tem mercados": (r) => {
        try {
          return JSON.parse(r.body).mercados?.length > 0;
        } catch {
          return false;
        }
      },
    });
  });
  sleep(1);
}

export function comparacao15() {
  fazerComparacao(LISTA_COMPRAS, "comparacao_15_itens");
}

export function comparacao20() {
  fazerComparacao(LISTA_GRANDE, "comparacao_20_itens");
}
