export interface MercadoInfo {
  nome: string;
  logo: string;
}

export interface MercadoCoords {
  lat: number;
  lng: number;
}

export const MERCADOS_MAP: Record<number, MercadoInfo> = {
  1: { nome: 'GoodBom',    logo: 'assets/img/goodbom.png' },
  2: { nome: 'PagueMenos', logo: 'assets/img/paguemenos.png' },
  3: { nome: 'São Vicente', logo: 'assets/img/saovicente.png' },
  4: { nome: 'Atacadão',   logo: 'assets/img/atacadao.png' },
  5: { nome: 'Imperial',   logo: 'assets/img/imperial.png' },
  6: { nome: 'Ponto Novo', logo: 'assets/img/pontonovo.jpeg' },
};

export const MERCADOS_COORDS: Record<number, MercadoCoords> = {
  1: { lat: -22.4006202, lng: -46.9700459 },   // GoodBom
  2: { lat: -22.3522237, lng: -46.9464079 },   // PagueMenos
  3: { lat: -22.4269813, lng: -46.9552736 },   // São Vicente
  4: { lat: -22.4022876, lng: -46.9727049 },   // Atacadão
  5: { lat: -22.4383822, lng: -46.9327464 },   // Imperial
  6: { lat: -22.4313656, lng: -46.9527085 },   // Ponto Novo
};

export const CATEGORIAS_MAP: Record<number, string> = {
  1: 'Bebidas', 2: 'Mercearia', 3: 'Bebidas',
  4: 'Laticínios', 5: 'Hortifruti', 6: 'Carnes',
  7: 'Limpeza', 8: 'Higiene', 9: 'Outros',
};

export const MEDALHAS = [
  'assets/img/ouro.png',
  'assets/img/prata.png',
  'assets/img/bronze.png',
];
