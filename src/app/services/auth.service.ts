import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export type TipoUsuario = 'usuario' | 'moderador' | 'admin' | null;

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private usuarioAtual = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioAtual.asObservable();

  private usuarios: Usuario[] = [
    { id: 1, nome: 'João Silva', email: 'usuario@arca.com', tipo: 'usuario' },
    { id: 2, nome: 'Maria Santos', email: 'moderador@arca.com', tipo: 'moderador' },
    { id: 3, nome: 'Admin ARCA', email: 'admin@arca.com', tipo: 'admin' }
  ];

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

  login(email: string, senha: string): boolean {
    const encontrado = this.usuarios.find(u => u.email === email);
    if (encontrado) {
      this.usuarioAtual.next(encontrado);
      localStorage.setItem('arca_usuario', JSON.stringify(encontrado));
      this.redirecionarPorTipo(encontrado.tipo);
      return true;
    }
    return false;
  }

  logout() {
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
