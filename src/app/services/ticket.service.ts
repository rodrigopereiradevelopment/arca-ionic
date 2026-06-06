import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface TicketMensagem {
  id: number;
  autor: 'usuario' | 'suporte';
  texto: string;
  created_at: string;
}

export interface Ticket {
  id: number;
  tipo: 'preco' | 'mercado' | 'bug' | 'sugestao' | 'duvida';
  titulo: string;
  descricao: string;
  status: 'aberto' | 'analise' | 'resolvido';
  created_at: string;
  updated_at: string;
}

export interface TicketListaResponse {
  data: Ticket[];
  total: number;
  page: number;
  limit: number;
}

type HeadersInit = Record<string, string>;
function authHeaders(token: string): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private auth = inject(AuthService);
  private apiUrl = environment.apiUrl + '/api/tickets';

  private get token() { return this.auth.usuario?.token; }

  async listar(page = 1, limit = 50): Promise<TicketListaResponse | null> {
    try {
      const tk = this.token; if (!tk) return null;
      const res = await fetch(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers: authHeaders(tk) });
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  }

  async criar(tipo: string, titulo: string, descricao: string): Promise<Ticket | null> {
    try {
      const tk = this.token; if (!tk) return null;
      const res = await fetch(this.apiUrl, {
        method: 'POST', headers: authHeaders(tk),
        body: JSON.stringify({ tipo, titulo, descricao, token: tk }),
      });
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  }

  async atualizarStatus(id: number, status: string): Promise<Ticket | null> {
    try {
      const tk = this.token; if (!tk) return null;
      const res = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT', headers: authHeaders(tk),
        body: JSON.stringify({ status, token: tk }),
      });
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  }

  async listarMensagens(ticketId: number): Promise<TicketMensagem[]> {
    try {
      const tk = this.token; if (!tk) return [];
      const res = await fetch(`${this.apiUrl}/${ticketId}/mensagens`, { headers: authHeaders(tk) });
      if (!res.ok) return [];
      return res.json();
    } catch { return []; }
  }

  async enviarMensagem(ticketId: number, texto: string): Promise<TicketMensagem | null> {
    try {
      const tk = this.token; if (!tk) return null;
      const res = await fetch(`${this.apiUrl}/${ticketId}/mensagens`, {
        method: 'POST', headers: authHeaders(tk),
        body: JSON.stringify({ texto, token: tk }),
      });
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  }
}
