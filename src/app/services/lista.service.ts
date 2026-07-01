import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface ItemLista {
  id?: number;
  nome: string;
  img?: string;
  quantidade: number;
  categoria?: string;
}

export interface ListaComparacao {
  id: number;
  nome: string;
  itens: ItemLista[];
  total_estimado: number;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ListaService {
  private auth = inject(AuthService);
  private readonly CACHE_KEY = 'arca_listas_cache';

  async listar(): Promise<ListaComparacao[]> {
    const token = this.auth.usuario?.token;
    if (!token) return this.listarLocal();

    try {
      const res = await fetch(`${environment.apiUrl}/api/auth/listas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return this.listarLocal();
      const data = await res.json();
      this.salvarCache(data);
      return data;
    } catch {
      return this.listarLocal();
    }
  }

  async criar(nome: string, itens: ItemLista[]): Promise<ListaComparacao | null> {
    const token = this.auth.usuario?.token;
    if (!token) return this.criarLocal(nome, itens);

    try {
      const res = await fetch(`${environment.apiUrl}/api/auth/listas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nome, itens, total_estimado: 0 })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return this.criarLocal(nome, itens);
    }
  }

  async atualizar(id: number, dados: Partial<ListaComparacao>): Promise<ListaComparacao | null> {
    const token = this.auth.usuario?.token;
    if (!token) return null;

    try {
      const res = await fetch(`${environment.apiUrl}/api/auth/listas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, id, ...dados })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async excluir(id: number): Promise<boolean> {
    const token = this.auth.usuario?.token;
    if (!token) return false;

    try {
      const res = await fetch(`${environment.apiUrl}/api/auth/listas`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, id })
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async duplicar(lista: ListaComparacao): Promise<ListaComparacao | null> {
    return this.criar(`${lista.nome} (cópia)`, [...lista.itens]);
  }

  // --- Fallback localStorage ---

  private listarLocal(): ListaComparacao[] {
    try {
      const raw = localStorage.getItem(this.CACHE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private criarLocal(nome: string, itens: ItemLista[]): ListaComparacao {
    const listas = this.listarLocal();
    const nova: ListaComparacao = {
      id: Date.now(),
      nome,
      itens,
      total_estimado: 0,
      created_at: new Date().toISOString()
    };
    listas.push(nova);
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(listas));
    return nova;
  }

  private salvarCache(listas: ListaComparacao[]) {
    try { localStorage.setItem(this.CACHE_KEY, JSON.stringify(listas)); } catch {}
  }
}
