import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.page.html',
  styleUrls: ['./esqueci-senha.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class EsqueciSenhaPage {
  private toastCtrl = inject(ToastController);

  email = '';
  enviado = false;
  carregando = false;

  async enviar() {
    if (!this.email) {
      await this.toast('Digite seu e-mail!', 'warning');
      return;
    }
    this.carregando = true;
    try {
      const res = await fetch(environment.apiUrl + '/api/auth/esqueci-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email })
      });
      const data = await res.json();
      if (data.erro) {
        await this.toast(data.erro, 'danger');
      } else {
        this.enviado = true;
      }
    } catch {
      await this.toast('Erro ao enviar solicitação.', 'danger');
    }
    this.carregando = false;
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }
}
