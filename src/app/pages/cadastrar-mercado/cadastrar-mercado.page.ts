import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonSelect,
  IonSelectOption,
  ToastController
} from '@ionic/angular/standalone';
import { MercadoService } from '../../services/mercado.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastrar-mercado',
  templateUrl: './cadastrar-mercado.page.html',
  styleUrls: ['./cadastrar-mercado.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
    IonSelect,
    IonSelectOption
  ]
})
export class CadastrarMercadoPage implements OnInit {

  form = {
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    admin_nome: '',
    admin_cpf: '',
    admin_email: '',
    admin_telefone: '',
    admin_senha: ''
  };

  imagemPreview: string | null = null;
  buscandoCep = false;
  enviando = false;

  constructor(
    private toastCtrl: ToastController,
    private mercadoSvc: MercadoService,
    private auth: AuthService
  ) {}
  ngOnInit() {}

  async buscarCep() {
    const cep = this.form.cep.replace(/\D/g, '');
    if (cep.length !== 8) {
      await this.toast('CEP inválido!', 'warning');
      return;
    }
    this.buscandoCep = true;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        await this.toast('CEP não encontrado!', 'warning');
      } else {
        this.form.rua = data.logradouro;
        this.form.bairro = data.bairro;
        this.form.cidade = data.localidade;
        this.form.estado = data.uf;
      }
    } catch {
      await this.toast('Erro ao buscar CEP!', 'danger');
    }
    this.buscandoCep = false;
  }

  onImagemSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagemPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  limpar() {
    this.form = {
      nome: '', cnpj: '', telefone: '', email: '',
      cep: '', rua: '', numero: '', complemento: '',
      bairro: '', cidade: '', estado: '',
      admin_nome: '', admin_cpf: '', admin_email: '',
      admin_telefone: '', admin_senha: ''
    };
    this.imagemPreview = null;
  }

  async enviar() {
    if (!this.form.nome || !this.form.cnpj || !this.form.telefone ||
        !this.form.cep || !this.form.rua || !this.form.numero ||
        !this.form.bairro || !this.form.cidade || !this.form.estado ||
        !this.form.admin_nome || !this.form.admin_cpf ||
        !this.form.admin_email || !this.form.admin_senha) {
      await this.toast('Preencha todos os campos obrigatórios!', 'warning');
      return;
    }
    const token = this.auth.usuario?.token;
    if (!token) {
      await this.toast('Faça login para cadastrar um mercado!', 'warning');
      return;
    }
    this.enviando = true;
    const resultado = await this.mercadoSvc.criar(this.form, token);
    this.enviando = false;
    if (resultado) {
      await this.toast('Mercado enviado para aprovação! ✅', 'success');
      this.limpar();
    } else {
      await this.toast('Erro ao cadastrar mercado. Tente novamente!', 'danger');
    }
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({
      message: msg, duration: 3000, color, position: 'top'
    });
    await t.present();
  }
}
