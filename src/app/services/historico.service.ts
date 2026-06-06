import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface ItemHistorico {
  id: number;
  tipo: 'pesquisa' | 'comparacao' | 'rota';
  descricao: string;
  detalhe: string;
  data: Date;
  icone: string;
  rota?: string;
}

const STORAGE_KEY = 'arca_historico';

@Injectable({ providedIn: 'root' })
export class HistoricoService {
  private auth = inject(AuthService);
  private itens = new BehaviorSubject<ItemHistorico[]>([]);
  itens$ = this.itens.asObservable();

  get lista() { return this.itens.getValue(); }

  constructor() {
    this.carregar();
  }

  async recarregar() {
    await this.carregar();
  }

  private async carregar() {
    const local = this.lerLocal();
    this.itens.next(local);

    if (this.auth.logado) {
      const api = await this.buscarApi();
      if (api && api.length > 0) {
        const merged = this.mergir(local, api);
        this.itens.next(merged);
        this.salvarLocal(merged);
      }
    }
  }

  private async buscarApi(): Promise<ItemHistorico[] | null> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return null;
      const res = await fetch(`${environment.apiUrl}/api/historico`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return (data ?? []).map((a: any) => ({
        id: a.id,
        tipo: a.tipo,
        descricao: a.descricao,
        detalhe: a.detalhe || '',
        data: new Date(a.created_at),
        icone: a.icone || '📋',
        rota: a.rota || undefined,
      }));
    } catch {
      return null;
    }
  }

  private mergir(local: ItemHistorico[], api: ItemHistorico[]): ItemHistorico[] {
    const vistos = new Set<number>();
    const resultado: ItemHistorico[] = [];

    for (const item of api) {
      vistos.add(item.id);
      resultado.push(item);
    }

    for (const item of local) {
      if (!vistos.has(item.id)) {
        resultado.push(item);
      }
    }

    return resultado.sort((a, b) => b.data.getTime() - a.data.getTime());
  }

  async adicionar(item: Omit<ItemHistorico, 'id' | 'data'>) {
    const id = Date.now();
    const data = new Date();
    const novo: ItemHistorico = { ...item, id, data };

    const atual = this.itens.getValue();
    this.itens.next([novo, ...atual]);
    this.salvarLocal(this.itens.getValue());

    if (this.auth.logado) {
      await this.salvarApi(item);
    }
  }

  private async salvarApi(item: Omit<ItemHistorico, 'id' | 'data'>) {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return;
      await fetch(`${environment.apiUrl}/api/historico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, token }),
      });
    } catch {}
  }

  async remover(id: number) {
    this.itens.next(this.itens.getValue().filter(i => i.id !== id));
    this.salvarLocal(this.itens.getValue());

    if (this.auth.logado) {
      try {
        const token = this.auth.usuario?.token;
        if (!token) return;
        await fetch(`${environment.apiUrl}/api/historico`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, token }),
        });
      } catch {}
    }
  }

  async limpar() {
    this.itens.next([]);
    localStorage.removeItem(STORAGE_KEY);

    if (this.auth.logado) {
      try {
        const token = this.auth.usuario?.token;
        if (!token) return;
        await fetch(`${environment.apiUrl}/api/historico`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ todas: true, token }),
        });
      } catch {}
    }
  }

  private lerLocal(): ItemHistorico[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return parsed.map((i: any) => ({ ...i, data: new Date(i.data) }));
    } catch {
      return [];
    }
  }

  private salvarLocal(itens: ItemHistorico[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
    } catch {}
  }
}
