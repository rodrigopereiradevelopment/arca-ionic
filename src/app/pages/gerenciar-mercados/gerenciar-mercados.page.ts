import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonModal,
  IonButton,
  ToastController
} from '@ionic/angular/standalone';

interface Mercado {
  id: number;
  nome: string;
  cidade: string;
  status: 'aprovado' | 'pendente' | 'desativado';
  responsavel: string;
  cnpj: string;
  telefone: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  estado: string;
  admin_nome: string;
  admin_cpf: string;
  admin_email: string;
  admin_telefone: string;
  admin_senha: string;
}

@Component({
  selector: 'app-gerenciar-mercados',
  templateUrl: './gerenciar-mercados.page.html',
  styleUrls: ['./gerenciar-mercados.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonModal, IonButton]
})
export class GerenciarMercadosPage implements OnInit {

  modalAberto = false;
  modoEdicao = false;
  buscandoCep = false;
  filtroNome = '';
  filtroStatus = 'todos';
  imagemPreview: string | null = null;

  mercados: Mercado[] = [
    { id: 1, nome: 'Big Bom', cidade: 'Mogi Mirim', status: 'aprovado', responsavel: 'João Silva',
      cnpj: '00.000.000/0001-00', telefone: '(19) 99999-0001', email: 'bigbom@email.com',
      cep: '13800-000', rua: 'Rua das Flores', numero: '100', complemento: '', bairro: 'Centro',
      estado: 'SP', admin_nome: 'João Silva', admin_cpf: '000.000.000-00',
      admin_email: 'joao@bigbom.com', admin_telefone: '(19) 99999-0001', admin_senha: '' },
    { id: 2, nome: 'Supermercado SMC', cidade: 'Mogi Mirim', status: 'pendente', responsavel: 'Maria Santos',
      cnpj: '00.000.000/0002-00', telefone: '(19) 99999-0002', email: 'smc@email.com',
      cep: '13800-100', rua: 'Av. Brasil', numero: '200', complemento: '', bairro: 'Jardim',
      estado: 'SP', admin_nome: 'Maria Santos', admin_cpf: '111.111.111-11',
      admin_email: 'maria@smc.com', admin_telefone: '(19) 99999-0002', admin_senha: '' },
    { id: 3, nome: 'Supermercado SPN', cidade: 'Mogi Mirim', status: 'desativado', responsavel: 'Pedro Costa',
      cnpj: '00.000.000/0003-00', telefone: '(19) 99999-0003', email: 'spn@email.com',
      cep: '13800-200', rua: 'Rua São Paulo', numero: '300', complemento: '', bairro: 'Vila Nova',
      estado: 'SP', admin_nome: 'Pedro Costa', admin_cpf: '222.222.222-22',
      admin_email: 'pedro@spn.com', admin_telefone: '(19) 99999-0003', admin_senha: '' }
  ];

  mercadoSelecionado: Mercado = this.novoMercado();
  
  get mercadosFiltrados() {
    return this.mercados.filter(m => {
      const nomeOk = m.nome.toLowerCase().includes(this.filtroNome.toLowerCase()) ||
                     m.cidade.toLowerCase().includes(this.filtroNome.toLowerCase()) ||
                     m.cnpj.includes(this.filtroNome);
      const statusOk = this.filtroStatus === 'todos' || m.status === this.filtroStatus;
      return nomeOk && statusOk;
    });
  }

  constructor(private toastCtrl: ToastController) {}
  ngOnInit() {}

  novoMercado(): Mercado {
    return {
      id: 0, nome: '', cidade: '', status: 'pendente', responsavel: '',
      cnpj: '', telefone: '', email: '', cep: '', rua: '', numero: '',
      complemento: '', bairro: '', estado: '',
      admin_nome: '', admin_cpf: '', admin_email: '', admin_telefone: '', admin_senha: ''
    };
  }

  abrirNovo() {
    this.modoEdicao = false;
    this.mercadoSelecionado = this.novoMercado();
    this.imagemPreview = null;
    this.modalAberto = true;
  }

  editar(m: Mercado) {
    this.modoEdicao = true;
    this.mercadoSelecionado = { ...m };
    this.imagemPreview = null;
    this.modalAberto = true;
  }

  async alterarStatus(m: Mercado, status: 'aprovado' | 'pendente' | 'desativado') {
    m.status = status;
    await this.toast(`Mercado ${status}!`, 'success');
  }

  async excluir(m: Mercado) {
    this.mercados = this.mercados.filter(x => x.id !== m.id);
    await this.toast('Mercado excluído!', 'danger');
  }

  async salvar() {
    if (!this.mercadoSelecionado.nome || !this.mercadoSelecionado.cnpj) {
      await this.toast('Preencha os campos obrigatórios!', 'warning');
      return;
    }
    if (this.modoEdicao) {
      const idx = this.mercados.findIndex(m => m.id === this.mercadoSelecionado.id);
      if (idx >= 0) this.mercados[idx] = { ...this.mercadoSelecionado };
      await this.toast('Mercado atualizado!', 'success');
    } else {
      this.mercadoSelecionado.id = Date.now();
      this.mercados.push({ ...this.mercadoSelecionado });
      await this.toast('Mercado cadastrado!', 'success');
    }
    this.modalAberto = false;
  }

  async buscarCep() {
    const cep = this.mercadoSelecionado.cep.replace(/\D/g, '');
    if (cep.length !== 8) { await this.toast('CEP inválido!', 'warning'); return; }
    this.buscandoCep = true;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        await this.toast('CEP não encontrado!', 'warning');
      } else {
        this.mercadoSelecionado.rua = data.logradouro;
        this.mercadoSelecionado.bairro = data.bairro;
        this.mercadoSelecionado.cidade = data.localidade;
        this.mercadoSelecionado.estado = data.uf;
      }
    } catch { await this.toast('Erro ao buscar CEP!', 'danger'); }
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

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }

  statusLabel(s: string) {
    return s === 'aprovado' ? 'Aprovado' : s === 'pendente' ? 'Pendente' : 'Desativado';
  }
}
