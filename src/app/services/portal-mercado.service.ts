import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface DashboardData {
  mercado: { id: number; nome: string; logo_url: string; status: string; cidade: string; responsavel: string };
  totalProdutos: number;
  precosAtivos: number;
  atualizacoesRecentes: Array<{ id: number; produtoId: number; nome: string; preco: number; data: string }>;
}

export interface ProdutoPreco {
  precoId: number;
  produtoId: number;
  nome: string;
  ean: string;
  imagem: string;
  preco: number;
  promocao: boolean;
  descricaoPromocao: string;
  verificado: boolean;
  data: string;
}

export interface ImportarResultado {
  importados: number;
  erros: number;
  resultados: Array<{ nome: string; preco: number }>;
  errosDetalhe: Array<{ linha: string; erro: string }>;
}

@Injectable({ providedIn: 'root' })
export class PortalMercadoService {
  private baseUrl = environment.apiUrl + '/api/mercado';

  private headers(token: string) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async dashboard(token: string): Promise<DashboardData | null> {
    try {
      const res = await fetch(`${this.baseUrl}`, { headers: this.headers(token) });
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  }

  async listarProdutos(token: string, pagina = 1, busca = ''): Promise<{ produtos: ProdutoPreco[]; pagina: number } | null> {
    try {
      const params = new URLSearchParams({ pagina: String(pagina) });
      if (busca) params.set('busca', busca);
      const res = await fetch(`${this.baseUrl}/produtos?${params}`, { headers: this.headers(token) });
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  }

  async atualizarPreco(token: string, produtoId: number, preco: number, promocao = false, descricaoPromocao = ''): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/produtos`, {
        method: 'POST',
        headers: this.headers(token),
        body: JSON.stringify({ acao: 'upsert', produtoId, preco, promocao, descricaoPromocao }),
      });
      return res.ok;
    } catch { return false; }
  }

  async importarCSV(token: string, linhas: Array<{ nome?: string; ean?: string; preco: string; promocao?: string; descricao_promocao?: string }>): Promise<ImportarResultado | null> {
    try {
      const res = await fetch(`${this.baseUrl}/produtos/importar`, {
        method: 'POST',
        headers: this.headers(token),
        body: JSON.stringify({ linhas }),
      });
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  }
}
