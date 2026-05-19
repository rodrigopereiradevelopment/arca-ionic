import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.js';

export type TipoUsuario = 'usuario' | 'moderador' | 'admin' | null;

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioAtual = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioAtual.asObservable();

  constructor(private router: Router) {
    const salvo = localStorage.getItem('arca_usuario');
    if (salvo) this.usuarioAtual.next(JSON.parse(salvo));
  }

  get usuario() { return this.usuarioAtual.getValue(); }
  get logado() { return !!this.usuarioAtual.getValue(); }
  get tipo() { return this.usuarioAtual.getValue()?.tipo; }
  get isAdmin() { return this.tipo === 'admin'; }
  get isModerador() { return this.tipo === 'moderador' || this.isAdmin; }
  get isUsuario() { return this.tipo === 'usuario'; }

  async login(email: string, senha: string): Promise<boolean> {
    try {
      const res = await fetch(environment.apiUrl + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      if (!res.ok) return false;
      const usuario = await res.json();
      if (usuario.erro) return false;
      this.usuarioAtual.next(usuario);
      localStorage.setItem('arca_usuario', JSON.stringify(usuario));
      this.redirecionarPorTipo(usuario.tipo);
      return true;
    } catch { return false; }
  }

  async cadastrar(nome: string, email: string, senha: string): Promise<{ ok: boolean; erro?: string }> {
    try {
      const res = await fetch(environment.apiUrl + '/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });
      const data = await res.json();
      if (data.erro) return { ok: false, erro: data.erro };
      return { ok: true };
    } catch (e: any) { return { ok: false, erro: e.message }; }
  }

  async logout() {
    try {
      await fetch(environment.apiUrl + '/api/auth/logout', { method: 'POST' });
    } catch {}
    this.usuarioAtual.next(null);
    localStorage.removeItem('arca_usuario');
    this.router.navigate(['/login']);
  }

  redirecionarPorTipo(tipo: TipoUsuario) {
    if (tipo === 'admin') this.router.navigate(['/gerenciar-mercados']);
    else if (tipo === 'moderador') this.router.navigate(['/gerenciar-produtos']);
    else this.router.navigate(['/home']);
  }
}
