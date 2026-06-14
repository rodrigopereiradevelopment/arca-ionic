import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular/standalone';
import {
  IonContent,
  IonButton,
  IonInput,
  IonLabel,
  IonCheckbox,
  IonRange,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonButton,
    IonInput,
    IonLabel,
    IonCheckbox,
    IonRange,
  ]
})
export class CadastroPage {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);


  form = {
    nome: '',
    email: '',
    senha: '',
    confirmSenha: '',
    cpf: '',
    telefone: '',
    cidade: 'Mogi Mirim',
    notifPush: true,
    notifEmail: true,
    notifPromocoes: true,
    raioBusca: 15,
    modoEscuro: false,
    permitirLocalizacao: false,
    aceiteTermos: false
  };

  mostrarSenha = false;
  mostrarConfirmSenha = false;

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  toggleConfirmSenha() {
    this.mostrarConfirmSenha = !this.mostrarConfirmSenha;
  }

  async criar() {
    if (!this.form.aceiteTermos) {
      await this.toast('Aceite os termos de uso para continuar.', 'warning');
      return;
    }
    if (this.form.senha !== this.form.confirmSenha) {
      await this.toast('As senhas não coincidem.', 'danger');
      return;
    }
    if (!this.form.nome || !this.form.email || !this.form.senha) {
      await this.toast('Preencha nome, e-mail e senha.', 'warning');
      return;
    }
    if (this.form.senha.length < 8) {
      await this.toast('A senha deve ter no mínimo 8 caracteres.', 'warning');
      return;
    }
    const result = await this.authService.cadastrar(this.form.nome, this.form.email, this.form.senha);
    if (!result.ok) {
      await this.toast(result.erro || 'Erro ao cadastrar.', 'danger');
      return;
    }
    await this.toast('Conta criada! Faça login.', 'success');
    this.router.navigate(['/login']);
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }

  limpar() {
    this.form = {
      nome: '',
      email: '',
      senha: '',
      confirmSenha: '',
      cpf: '',
      telefone: '',
      cidade: 'Mogi Mirim',
      notifPush: true,
      notifEmail: true,
      notifPromocoes: true,
      raioBusca: 15,
      modoEscuro: false,
      permitirLocalizacao: false,
      aceiteTermos: false
    };
  }
}