import { Component, OnInit } from '@angular/core';
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
export class LoginPage implements OnInit {

  email = '';
  senha = '';
  mostrarSenha = false;
  carregando = false;

  acessos = [
    { tipo: 'Usuário', email: 'usuario@arca.com' },
    { tipo: 'Moderador', email: 'moderador@arca.com' },
    { tipo: 'Admin', email: 'admin@arca.com' }
  ];

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  async login() {
    if (!this.email || !this.senha) {
      await this.toast('Preencha e-mail e senha!', 'warning');
      return;
    }
    this.carregando = true;
    const ok = this.authService.login(this.email, this.senha);
    if (!ok) await this.toast('E-mail ou senha incorretos!', 'danger');
    this.carregando = false;
  }

  preencherEmail(email: string) {
    this.email = email;
    this.senha = '123456';
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({
      message: msg, duration: 3000, color, position: 'top'
    });
    await t.present();
  }
}
