import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'moderador' | 'user';
  dataCadastro: string;
}

@Component({
  selector: 'app-gerenciar-usuarios',
  templateUrl: './gerenciar-usuarios.page.html',
  styleUrls: ['./gerenciar-usuarios.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class GerenciarUsuariosPage {
  modalAberto = false;
  filtroNome = '';
  filtroPerfil = 'todos';
  usuarios: Usuario[] = [];
  carregando = false;

  get usuariosFiltrados() {
    return this.usuarios.filter(u => {
      const nomeOk = u.nome?.toLowerCase().includes(this.filtroNome.toLowerCase()) ||
                     u.email?.toLowerCase().includes(this.filtroNome.toLowerCase());
      const perfilOk = this.filtroPerfil === 'todos' || u.role === this.filtroPerfil;
      return nomeOk && perfilOk;
    });
  }

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  async ionViewWillEnter() {
    await this.carregarUsuarios();
  }

  async carregarUsuarios() {
    const token = this.authService.usuario?.token;
    if (!token) return;
    this.carregando = true;
    try {
      const res = await fetch(`${environment.apiUrl}/api/auth/usuarios?token=${token}`);
      this.usuarios = await res.json();
    } catch { await this.toast('Erro ao carregar usuários.', 'danger'); }
    this.carregando = false;
  }

  async alterarRole(u: Usuario, role: 'admin' | 'moderador' | 'user') {
    const token = this.authService.usuario?.token;
    if (!token) return;
    try {
      const res = await fetch(`${environment.apiUrl}/api/auth/usuarios`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userId: u.id, role })
      });
      const data = await res.json();
      if (data.erro) { await this.toast(data.erro, 'danger'); return; }
      u.role = role;
      await this.toast(`${u.nome} agora é ${this.roleLabel(role)}!`, 'success');
    } catch { await this.toast('Erro ao alterar perfil.', 'danger'); }
  }

  async excluir(u: Usuario) {
    const token = this.authService.usuario?.token;
    if (!token) return;
    try {
      const res = await fetch(`${environment.apiUrl}/api/auth/usuarios`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userId: u.id })
      });
      const data = await res.json();
      if (data.erro) { await this.toast(data.erro, 'danger'); return; }
      this.usuarios = this.usuarios.filter(x => x.id !== u.id);
      await this.toast(`${u.nome} removido!`, 'danger');
    } catch { await this.toast('Erro ao excluir usuário.', 'danger'); }
  }

  roleLabel(r: string) {
    if (r === 'admin') return 'Administrador';
    if (r === 'moderador') return 'Moderador';
    return 'Usuário';
  }

  roleCor(r: string) {
    if (r === 'admin') return 'badge-admin';
    if (r === 'moderador') return 'badge-mod';
    return 'badge-user';
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }
}