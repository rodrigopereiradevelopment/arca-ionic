import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Mercado {
  id: number;
  nome: string;
  cidade: string;
  status: 'aprovado' | 'pendente' | 'desativado';
  responsavel: string;
  cnpj: string;
  telefone: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  estado: string;
  admin_nome: string;
  admin_cpf: string;
  admin_email: string;
  admin_telefone: string;
  admin_senha: string;
  logo_url: string;
  latitude: number;
  longitude: number;
  endereco: string;
}

type HeadersInit = Record<string, string>;

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

const CAMPOS_LIMPAR = ['cnpj', 'telefone', 'cep', 'admin_cpf', 'admin_telefone'];

function limparMascara(dados: Record<string, any>): Record<string, any> {
  const copia = { ...dados };
  for (const campo of CAMPOS_LIMPAR) {
    if (typeof copia[campo] === 'string') {
      copia[campo] = copia[campo].replace(/\D/g, '');
    }
  }
  return copia;
}

@Injectable({ providedIn: 'root' })
export class MercadoService {
  private apiUrl = environment.apiUrl + '/api/mercados';

  async listar(status?: string): Promise<Mercado[]> {
    const params = new URLSearchParams();
    if (status && status !== 'todos') params.set('status', status);
    const url = params.toString() ? `${this.apiUrl}?${params}` : this.apiUrl;
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  }

  async criar(dados: Partial<Mercado>, token: string): Promise<Mercado | null> {
    try {
      const body = limparMascara({ ...dados, token });
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(body),
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }

  async atualizar(id: number, dados: Partial<Mercado>, token: string): Promise<Mercado | null> {
    try {
      const body = limparMascara({ ...dados, id, token });
      const res = await fetch(this.apiUrl, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(body),
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
