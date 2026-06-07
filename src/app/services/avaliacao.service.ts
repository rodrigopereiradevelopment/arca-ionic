import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Avaliacao {
  id?: number;
  supermercado_id: number;
  nota_geral: number;
  nota_atendimento?: number;
  nota_qualidade?: number;
  nota_preco?: number;
  comentario?: string;
}

export interface MediaAvaliacao {
  media_geral: number;
  media_atendimento: number;
  media_qualidade: number;
  media_preco: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class AvaliacaoService {
  private auth = inject(AuthService);

  async getMedias(supermercadoId: number): Promise<MediaAvaliacao | null> {
    try {
      const res = await fetch(
        `${environment.apiUrl}/api/avaliacoes?supermercado_id=${supermercadoId}`
      );
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async getResumo() {
    try {
      const res = await fetch(`${environment.apiUrl}/api/avaliacoes`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  async salvar(avaliacao: Avaliacao): Promise<boolean> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return false;
      const res = await fetch(`${environment.apiUrl}/api/avaliacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...avaliacao }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  estrelas(nota: number): string {
    const cheias = Math.round(nota);
    return '★'.repeat(cheias) + '☆'.repeat(5 - cheias);
  }
}
