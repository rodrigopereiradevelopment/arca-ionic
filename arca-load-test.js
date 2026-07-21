import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE = 'https://arca-next.vercel.app';
const falhas = new Rate('requisicoes_falhas');
const tempoComparacao = new Trend('tempo_comparacao_ms');
const tempoBusca = new Trend('tempo_busca_ms');

const PRODUTOS_BUSCA = [
  'ARROZ', 'FEIJAO', 'OLEO', 'SAL', 'ACUCAR', 'CAFE', 'LEITE',
  'SABAO', 'DETERGENTE', 'PAPEL HIGIENICO', 'MACARRAO', 'FARINHA',
  'BISCOITO', 'REFRIGERANTE', 'AGUA', 'CARNE', 'FRANGO', 'OVOS'
];

const LISTA_COMPRAS = [
  { nome: 'ARROZ CAMIL', quantidade: 1 },
  { nome: 'FEIJAO CARIOCA', quantidade: 2 },
  { nome: 'OLEO SOJA', quantidade: 1 },
  { nome: 'ACUCAR CRISTAL', quantidade: 1 },
  { nome: 'CAFE PILAO', quantidade: 1 },
  { nome: 'LEITE INTEGRAL', quantidade: 3 },
  { nome: 'SABAO PO', quantidade: 1 },
  { nome: 'DETERGENTE LIQUIDO', quantidade: 2 },
  { nome: 'PAPEL HIGIENICO', quantidade: 4 },
  { nome: 'MACARRAO SPAGHETTI', quantidade: 2 },
  { nome: 'FARINHA TRIGO', quantidade: 1 },
  { nome: 'BISCOITO RECHEADO', quantidade: 3 },
  { nome: 'REFRIGERANTE COLA', quantidade: 2 },
  { nome: 'AGUA MINERAL', quantidade: 6 },
  { nome: 'CARNE MOIDA', quantidade: 2 },
];

const LISTA_GRANDE = [
  ...LISTA_COMPRAS,
  { nome: 'FRANGO CONGELADO', quantidade: 1 },
  { nome: 'OVOS BRANCOS', quantidade: 2 },
  { nome: 'MANTEIGA COM SAL', quantidade: 1 },
  { nome: 'QUEIJO MUSSARELA', quantidade: 1 },
  { nome: 'ABACATE', quantidade: 1 },
];

// CATEGORIA_IDs
const CATEGORIAS = [
  { id: 1, nome: 'Laticinios' },
  { id: 3, nome: 'Bebidas' },
  { id: 4, nome: 'Higiene e Limpeza' },
  { id: 7, nome: 'Graos e Cereais' },
  { id: 9, nome: 'Mercearia' },
];

function pegaAleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const options = {
  noCookiesReset: true,
  setupTimeout: '5s',
  teardownTimeout: '5s',
  thresholds: {
    http_req_failed: ['rate<0.10'],
    tempo_busca_ms: ['p(95)<15000', 'avg<5000'],
    tempo_comparacao_ms: ['p(95)<15000', 'avg<8000'],
  },
  scenarios: {
    busca: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '30s', target: 10 },
        { duration: '10s', target: 0 },
      ],
      exec: 'cenarioBusca',
      tags: { cenario: 'busca' },
    },
    comparacao_pequena: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 2 },
        { duration: '20s', target: 2 },
        { duration: '10s', target: 0 },
      ],
      exec: 'cenarioComparacaoPequena',
      tags: { cenario: 'comparacao_15_itens' },
    },
    comparacao_grande: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 1 },
        { duration: '20s', target: 1 },
        { duration: '10s', target: 0 },
      ],
      exec: 'cenarioComparacaoGrande',
      tags: { cenario: 'comparacao_20_itens' },
    },
    navegacao_categoria: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 8 },
        { duration: '20s', target: 8 },
        { duration: '10s', target: 0 },
      ],
      exec: 'cenarioCategoria',
      tags: { cenario: 'navegacao_categoria' },
    },
  },
};

export function cenarioBusca() {
  group('Busca de produtos', () => {
    const q = pegaAleatorio(PRODUTOS_BUSCA);
    const res = http.get(`${BASE}/api/produtos/search?q=${encodeURIComponent(q)}`, {
      tags: { tipo: 'busca' },
      timeout: '20s',
    });
    tempoBusca.add(res.timings.duration);
    falhas.add(!(res.status >= 200 && res.status < 400));
    check(res, {
      'status 200': (r) => r.status === 200,
      'tempo < 1s': (r) => r.timings.duration < 1000,
      'tem dados': (r) => {
        try { return JSON.parse(r.body).data?.length > 0; }
        catch { return false; }
      },
    });
  });
  sleep(0.5);
}

export function cenarioComparacaoPequena() {
  group('Comparacao 15 itens', () => {
    const payload = JSON.stringify({ produtos: LISTA_COMPRAS });
    const res = http.post(`${BASE}/api/comparar`, payload, {
      headers: { 'Content-Type': 'application/json' },
      tags: { tipo: 'comparacao_pequena' },
      timeout: '15s',
    });
    tempoComparacao.add(res.timings.duration);
    falhas.add(!(res.status >= 200 && res.status < 400));
    check(res, {
      'status 200': (r) => r.status === 200,
      'tempo < 8s': (r) => r.timings.duration < 8000,
      'sucesso true': (r) => {
        try { return JSON.parse(r.body).sucesso === true; }
        catch { return false; }
      },
      'tem mercados': (r) => {
        try { return JSON.parse(r.body).mercados?.length > 0; }
        catch { return false; }
      },
    });
  });
  sleep(1);
}

export function cenarioComparacaoGrande() {
  group('Comparacao 20 itens (chunked frontend)', () => {
    const payload = JSON.stringify({ produtos: LISTA_GRANDE });
    const res = http.post(`${BASE}/api/comparar`, payload, {
      headers: { 'Content-Type': 'application/json' },
      tags: { tipo: 'comparacao_grande' },
      timeout: '15s',
    });
    tempoComparacao.add(res.timings.duration);
    falhas.add(!(res.status >= 200 && res.status < 400));
    check(res, {
      'status 200': (r) => r.status === 200,
      'tempo < 8s': (r) => r.timings.duration < 8000,
      'sucesso true': (r) => {
        try { return JSON.parse(r.body).sucesso === true; }
        catch { return false; }
      },
      'tem mercados': (r) => {
        try { return JSON.parse(r.body).mercados?.length > 0; }
        catch { return false; }
      },
    });
  });
  sleep(1);
}

export function cenarioCategoria() {
  group('Navegacao por categoria', () => {
    const cat = pegaAleatorio(CATEGORIAS);
    const res = http.get(`${BASE}/api/produtos/search?categoria_id=${cat.id}`, {
      tags: { tipo: 'categoria' },
      timeout: '20s',
    });
    tempoBusca.add(res.timings.duration);
    falhas.add(!(res.status >= 200 && res.status < 400));
    check(res, {
      'status 200': (r) => r.status === 200,
      'tempo < 1s': (r) => r.timings.duration < 1000,
      'tem dados': (r) => {
        try { return JSON.parse(r.body).data?.length > 0; }
        catch { return false; }
      },
    });
  });
  sleep(0.5);
}
