import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonInput,
  IonLabel,
  IonCheckbox,
  IonRange,
  IonSelect,
  IonSelectOption
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
    IonSelect,
    IonSelectOption
  ]
})
export class CadastroPage implements OnInit {

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

  constructor(private router: Router) {}

  ngOnInit() {}

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  toggleConfirmSenha() {
    this.mostrarConfirmSenha = !this.mostrarConfirmSenha;
  }

  criar() {
    if (!this.form.aceiteTermos) {
      alert('Aceite os termos de uso para continuar.');
      return;
    }
    if (this.form.senha !== this.form.confirmSenha) {
      alert('As senhas não coincidem.');
      return;
    }
    console.log('Cadastro:', this.form);
    this.router.navigate(['/home']);
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