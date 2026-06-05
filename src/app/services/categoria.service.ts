import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  icone: string;
  totalProdutos: number;
}

type HeadersInit = Record<string, string>;

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private apiUrl = environment.apiUrl + '/api/categorias';

  async listar(): Promise<Categoria[]> {
    try {
      const res = await fetch(this.apiUrl);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  }

  async criar(
    nome: string,
    token: string,
    descricao?: string,
    icone?: string
  ): Promise<Categoria | null> {
    try {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ nome, descricao, icone, token }),
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }

  async atualizar(
    id: number,
    dados: Partial<Categoria>,
    token: string
  ): Promise<Categoria | null> {
    try {
      const res = await fetch(this.apiUrl, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify({ ...dados, id, token }),
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
}
