import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: 'alerta_preco' | 'promocao' | 'sistema' | 'marketing';
  lida: boolean;
  created_at: string;
  data_leitura: string | null;
  dados_extras: any;
}

export interface NotificacoesResponse {
  data: Notificacao[];
  total: number;
  page: number;
  limit: number;
  naoLidas: number;
}

type HeadersInit = Record<string, string>;

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  private auth = inject(AuthService);
  private apiUrl = environment.apiUrl + '/api/notificacoes';

  async listar(page = 1, limit = 50): Promise<NotificacoesResponse | null> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return null;
      const res = await fetch(`${this.apiUrl}?page=${page}&limit=${limit}`, {
        headers: authHeaders(token),
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }

  async criar(
    titulo: string,
    mensagem: string,
    tipo: Notificacao['tipo'] = 'sistema',
    dados_extras?: any
  ): Promise<Notificacao | null> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return null;
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ titulo, mensagem, tipo, dados_extras, token }),
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }

  async marcarLida(id: number): Promise<boolean> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return false;
      const res = await fetch(this.apiUrl, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify({ id, lida: true, token }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async marcarTodasLidas(): Promise<boolean> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return false;
      const res = await fetch(this.apiUrl, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify({ todas: true, lida: true, token }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async remover(id: number): Promise<boolean> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return false;
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

  async limparTodas(): Promise<boolean> {
    try {
      const token = this.auth.usuario?.token;
      if (!token) return false;
      const res = await fetch(this.apiUrl, {
        method: 'DELETE',
        headers: authHeaders(token),
        body: JSON.stringify({ todas: true, token }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
