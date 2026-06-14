import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.page.html',
  styleUrls: ['./redefinir-senha.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class RedefinirSenhaPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  token = '';
  novaSenha = '';
  confirmarSenha = '';
  mostrarSenha = false;
  carregando = false;
  concluido = false;

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  async redefinir() {
    if (!this.token) {
      await this.toast('Token inválido ou ausente.', 'danger');
      return;
    }
    if (!this.novaSenha || this.novaSenha.length < 8) {
      await this.toast('Senha deve ter no mínimo 8 caracteres.', 'warning');
      return;
    }
    if (this.novaSenha !== this.confirmarSenha) {
      await this.toast('Senhas não conferem.', 'danger');
      return;
    }
    this.carregando = true;
    try {
      const res = await fetch(environment.apiUrl + '/api/auth/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.token, novaSenha: this.novaSenha })
      });
      const data = await res.json();
      if (data.erro) {
        await this.toast(data.erro, 'danger');
      } else {
        this.concluido = true;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      }
    } catch {
      await this.toast('Erro ao redefinir senha.', 'danger');
    }
    this.carregando = false;
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }
}
