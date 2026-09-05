export interface MercadoInfo {
  nome: string;
  logo: string;
}

export interface MercadoCoords {
  lat: number;
  lng: number;
}

export const MERCADOS_MAP: Record<number, MercadoInfo> = {
  1: { nome: 'Imperial',   logo: 'assets/img/imperial.png' },
  2: { nome: 'Ponto Novo', logo: 'assets/img/pontonovo.jpeg' },
  3: { nome: 'GoodBom',    logo: 'assets/img/goodbom.png' },
  4: { nome: 'Atacadão',   logo: 'assets/img/atacadao.png' },
  5: { nome: 'Pague Menos', logo: 'assets/img/paguemenos.png' },
  6: { nome: 'São Vicente', logo: 'assets/img/saovicente.png' },
  7: { nome: 'Mercado Teste ARCA', logo: 'assets/img/teste-arca.png' },
  8: { nome: 'Wild Store', logo: 'assets/img/teste-wild.png' },
};

export const MERCADOS_COORDS: Record<number, MercadoCoords> = {
  1: { lat: -22.4383822, lng: -46.9327464 },   // Imperial
  2: { lat: -22.4313656, lng: -46.9527085 },   // Ponto Novo
  3: { lat: -22.4006202, lng: -46.9700459 },   // GoodBom
  4: { lat: -22.4022876, lng: -46.9727049 },   // Atacadão
  5: { lat: -22.3522237, lng: -46.9464079 },   // Pague Menos
  6: { lat: -22.4269813, lng: -46.9552736 },   // São Vicente
};

export const CATEGORIAS_MAP: Record<number, string> = {
  1: 'Laticínios', 2: 'Carnes e Peixes', 3: 'Bebidas',
  4: 'Higiene e Limpeza', 5: 'Padaria e Confeitaria', 6: 'Frutas e Verduras',
  7: 'Grãos e Cereais', 8: 'Congelados', 9: 'Mercearia', 10: 'Petiscos e Snacks',
};

export const MEDALHAS = [
  'assets/img/ouro.png',
  'assets/img/prata.png',
  'assets/img/bronze.png',
];
