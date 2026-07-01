import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Denuncia {
  id: number;
  motivo: string;
  descricao: string;
  status: 'pendente' | 'resolvido' | 'rejeitado';
  created_at: string;
  resolvido_em: string | null;
  produto_id: number | null;
  preco_id: number | null;
  supermercado_id: number | null;
  user_id: string;
  moderador_id: string | null;
  produtos?: { nome: string; imagem_url: string } | null;
  supermercados?: { nome: string; logo_url: string } | null;
}

@Injectable({ providedIn: 'root' })
export class DenunciaService {
  private auth = inject(AuthService);

  async criar(data: {
    motivo: string;
    descricao?: string;
    produto_id?: number;
    preco_id?: number;
    supermercado_id?: number;
  }): Promise<string | null> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return 'Faça login para denunciar.';
      const res = await fetch(`${environment.apiUrl}/api/denuncias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, token }),
      });
      const json = await res.json();
      return json.erro || null;
    } catch {
      return 'Erro ao enviar denúncia.';
    }
  }

  async listar(): Promise<Denuncia[]> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return [];
      const res = await fetch(`${environment.apiUrl}/api/denuncias`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  async resolver(denunciaId: number): Promise<boolean> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return false;
      const res = await fetch(`${environment.apiUrl}/api/denuncias`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, denuncia_id: denunciaId, status: 'resolvido' }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  readonly MOTIVOS = [
    { value: 'preco_incorreto', label: '💰 Preço incorreto' },
    { value: 'produto_ausente', label: '📦 Produto não encontrado no mercado' },
    { value: 'info_errada', label: '📝 Informação do produto errada' },
    { value: 'imagem_errada', label: '🖼️ Imagem incorreta' },
    { value: 'outro', label: '❓ Outro' },
  ];
}
