import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  marca: string;
  ean: string;
  categoria: string;
  categoria_id: number | null;
  imagem_url: string;
  ativo: boolean;
  tipo: string;
  peso_volume: string;
  precosAtivos: number;
  created_at: string;
}

export interface ProdutoLista {
  data: Produto[];
  total: number;
  page: number;
  limit: number;
}

export interface Preco {
  id: number;
  preco: number;
  promocao: boolean;
  descricao_promocao: string;
  data_coleta: string;
  supermercado_id: number;
  supermercado: string;
  produto?: string;
  produto_id?: number;
}

type HeadersInit = Record<string, string>;

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private apiUrl = environment.apiUrl + '/api/produtos';

  async listar(params?: {
    busca?: string;
    categoria_id?: number;
    ativo?: string;
    page?: number;
    limit?: number;
  }): Promise<ProdutoLista> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.busca) searchParams.set('busca', params.busca);
      if (params?.categoria_id) searchParams.set('categoria_id', String(params.categoria_id));
      if (params?.ativo) searchParams.set('ativo', params.ativo);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));

      const url = searchParams.toString()
        ? `${this.apiUrl}?${searchParams}`
        : this.apiUrl;

      const res = await fetch(url);
      if (!res.ok) return { data: [], total: 0, page: 1, limit: 10 };
      return res.json();
    } catch {
      return { data: [], total: 0, page: 1, limit: 10 };
    }
  }

  async criar(
    dados: Partial<Produto>,
    token: string,
    imagemFile?: File
  ): Promise<Produto | null> {
    try {
      let imagemUrl = dados.imagem_url || '';

      if (imagemFile) {
        const uploaded = await this.uploadImagem(imagemFile, token);
        if (uploaded) imagemUrl = uploaded;
      }

      const body = { ...dados, token, imagem_url: imagemUrl };
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(body),
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }

  async atualizar(
    id: number,
    dados: Partial<Produto>,
    token: string,
    imagemFile?: File
  ): Promise<Produto | null> {
    try {
      let imagemUrl = dados.imagem_url;

      if (imagemFile) {
        const uploaded = await this.uploadImagem(imagemFile, token);
        if (uploaded) imagemUrl = uploaded;
      }

      const body: any = { ...dados, id, token };
      if (imagemUrl !== undefined) body.imagem_url = imagemUrl;

      const res = await fetch(this.apiUrl, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(body),
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }

  async excluir(id: number, token: string): Promise<boolean> {
    try {
      const res = await fetch(this.apiUrl, {
        method: 'DELETE',
        headers: authHeaders(token),
        body: JSON.stringify({ id, token }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async listarPrecos(produtoId?: number): Promise<Preco[]> {
    try {
      const params = produtoId ? `?produto_id=${produtoId}` : '';
      const res = await fetch(`${this.apiUrl}/precos${params}`);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  }

  private async uploadImagem(
    file: File,
    token: string
  ): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('arquivo', file);
      formData.append('token', token);

      const res = await fetch(environment.apiUrl + '/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.url || null;
    } catch {
      return null;
    }
  }
}
