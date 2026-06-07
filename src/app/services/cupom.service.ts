import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Cupom {
  id: number;
  codigo: string;
  descricao: string;
  tipo: 'percentual' | 'fixo';
  valor: number;
  valor_desconto: number;
  percentual_desconto: number;
  valor_minimo: number;
  data_inicio: string;
  data_fim: string;
  maximo_usos: number;
  usos_realizados: number;
  supermercado: { nome: string; logo_url: string } | null;
  supermercado_id: number;
}

@Injectable({ providedIn: 'root' })
export class CupomService {
  private auth = inject(AuthService);

  async listar(): Promise<Cupom[]> {
    try {
      const res = await fetch(`${environment.apiUrl}/api/cupons`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  async usar(cupomId: number): Promise<string | null> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return 'Faça login para usar cupons.';
      const res = await fetch(`${environment.apiUrl}/api/cupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, cupom_id: cupomId }),
      });
      const data = await res.json();
      return data.erro || null;
    } catch {
      return 'Erro ao usar cupom.';
    }
  }
}
