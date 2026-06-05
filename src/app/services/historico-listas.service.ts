import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface HistoricoListaItem {
  produto_id: number;
  nome: string;
  img: string;
  quantidade: number;
  menorPreco: number;
  mercadoMaisBarato: string;
}

export interface HistoricoLista {
  id: number;
  nome: string;
  itens: HistoricoListaItem[];
  total_estimado: number;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class HistoricoListasService {
  private auth = inject(AuthService);

  private get token() {
    return this.auth.usuario?.token;
  }

  async listar(): Promise<HistoricoLista[]> {
    if (!this.auth.logado) return [];
    try {
      const res = await fetch(`${environment.apiUrl}/api/historico-listas`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  async salvar(nome: string, itens: any[]): Promise<HistoricoLista | null> {
    if (!this.auth.logado || itens.length === 0) return null;
    try {
      const res = await fetch(`${environment.apiUrl}/api/historico-listas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.token, nome, itens }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async restaurar(id: number): Promise<boolean> {
    if (!this.auth.logado) return false;
    try {
      const res = await fetch(`${environment.apiUrl}/api/historico-listas/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.token }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async excluir(id: number): Promise<boolean> {
    if (!this.auth.logado) return false;
    try {
      const res = await fetch(`${environment.apiUrl}/api/historico-listas/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.token }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
