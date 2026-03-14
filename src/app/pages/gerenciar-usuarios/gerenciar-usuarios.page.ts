import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: 'admin' | 'moderador' | 'usuario';
  status: 'ativo' | 'bloqueado';
  dataCadastro: string;
}

@Component({
  selector: 'app-gerenciar-usuarios',
  templateUrl: './gerenciar-usuarios.page.html',
  styleUrls: ['./gerenciar-usuarios.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class GerenciarUsuariosPage implements OnInit {

  modalAberto = false;
  filtroNome = '';
  filtroPerfil = 'todos';
  conviteEmail = '';
  convitePerfil: 'admin' | 'moderador' | 'usuario' = 'usuario';

  usuarios: Usuario[] = [
    { id: 1, nome: 'João Silva', email: 'joao@email.com', perfil: 'admin', status: 'ativo', dataCadastro: '01/01/2026' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', perfil: 'moderador', status: 'ativo', dataCadastro: '15/01/2026' },
    { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', perfil: 'usuario', status: 'ativo', dataCadastro: '20/01/2026' },
    { id: 4, nome: 'Ana Souza', email: 'ana@email.com', perfil: 'usuario', status: 'bloqueado', dataCadastro: '05/02/2026' }
  ];

  get usuariosFiltrados() {
    return this.usuarios.filter(u => {
      const nomeOk = u.nome.toLowerCase().includes(this.filtroNome.toLowerCase()) ||
                     u.email.toLowerCase().includes(this.filtroNome.toLowerCase());
      const perfilOk = this.filtroPerfil === 'todos' || u.perfil === this.filtroPerfil;
      return nomeOk && perfilOk;
    });
  }

  constructor(private toastCtrl: ToastController) {}
  ngOnInit() {}

  async alterarPerfil(u: Usuario, perfil: 'admin' | 'moderador' | 'usuario') {
    u.perfil = perfil;
    await this.toast(`Perfil de ${u.nome} alterado para ${this.perfilLabel(perfil)}!`, 'success');
  }

  async alterarStatus(u: Usuario) {
    u.status = u.status === 'ativo' ? 'bloqueado' : 'ativo';
    const msg = u.status === 'ativo' ? `${u.nome} desbloqueado!` : `${u.nome} bloqueado!`;
    await this.toast(msg, u.status === 'ativo' ? 'success' : 'warning');
  }

  async excluir(u: Usuario) {
    this.usuarios = this.usuarios.filter(x => x.id !== u.id);
    await this.toast(`${u.nome} removido!`, 'danger');
  }

  async enviarConvite() {
    if (!this.conviteEmail) {
      await this.toast('Digite o e-mail do convidado!', 'warning');
      return;
    }
    await this.toast(`Convite enviado para ${this.conviteEmail}!`, 'success');
    this.conviteEmail = '';
    this.convitePerfil = 'usuario';
    this.modalAberto = false;
  }

  perfilLabel(p: string) {
    if (p === 'admin') return 'Administrador';
    if (p === 'moderador') return 'Moderador';
    return 'Usuário';
  }

  perfilCor(p: string) {
    if (p === 'admin') return 'badge-admin';
    if (p === 'moderador') return 'badge-mod';
    return 'badge-user';
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }
}
