import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Favorito {
  id: number;
  produto_id: number;
  created_at: string;
  nome: string;
  imagem_url: string;
  marca: string;
  menorPreco: number;
  mercadoMaisBarato: string;
  precos: { valor: number; promocao: boolean; mercado: string; logo: string }[];
}

@Injectable({ providedIn: 'root' })
export class FavoritoService {
  private auth = inject(AuthService);
  private idsCache = new Set<number>();
  private favoritosCache: Favorito[] = [];

  get lista(): Favorito[] {
    return this.favoritosCache;
  }

  isFavorito(produtoId: number): boolean {
    return this.idsCache.has(produtoId);
  }

  async listar(): Promise<Favorito[]> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return [];
      const res = await fetch(`${environment.apiUrl}/api/favoritos?token=${encodeURIComponent(token)}`);
      if (!res.ok) return [];
      const data = await res.json();
      this.favoritosCache = data;
      this.idsCache = new Set(data.map((f: Favorito) => f.produto_id));
      return data;
    } catch {
      return [];
    }
  }

  async adicionar(produtoId: number): Promise<boolean> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return false;
      const res = await fetch(`${environment.apiUrl}/api/favoritos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, produto_id: produtoId }),
      });
      const ok = res.ok || (await res.json())?.mensagem === 'Produto já favoritado.';
      if (ok) this.idsCache.add(produtoId);
      return ok;
    } catch {
      return false;
    }
  }

  async remover(produtoId: number): Promise<boolean> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return false;
      const res = await fetch(
        `${environment.apiUrl}/api/favoritos?token=${encodeURIComponent(token)}&produto_id=${produtoId}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        this.idsCache.delete(produtoId);
        this.favoritosCache = this.favoritosCache.filter(f => f.produto_id !== produtoId);
      }
      return res.ok;
    } catch {
      return false;
    }
  }

  async toggle(produtoId: number): Promise<boolean> {
    if (this.isFavorito(produtoId)) {
      await this.remover(produtoId);
      return false;
    }
    await this.adicionar(produtoId);
    return true;
  }
}
