import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class LoginPage {

  email = '';
  senha = '';
  mostrarSenha = false;
  carregando = false;

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  async login() {
    if (!this.email || !this.senha) {
      await this.toast('Preencha e-mail e senha!', 'warning');
      return;
    }
    this.carregando = true;
    const ok = await this.authService.login(this.email, this.senha);
    if (!ok) await this.toast('E-mail ou senha incorretos!', 'danger');
    this.carregando = false;
  }

  loginGoogle() {
    window.location.href = 'https://srajnelbzbyzxjmjjqku.supabase.co/auth/v1/authorize?provider=google&redirect_to=http://localhost:8100';
  }

  loginFacebook() {
    window.location.href = 'https://srajnelbzbyzxjmjjqku.supabase.co/auth/v1/authorize?provider=facebook&redirect_to=http://localhost:8100';
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({
      message: msg, duration: 3000, color, position: 'top'
    });
    await t.present();
  }
}