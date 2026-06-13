import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  ToastController
} from '@ionic/angular/standalone';
import { MercadoService, Mercado } from '../../services/mercado.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-gerenciar-mercados',
  templateUrl: './gerenciar-mercados.page.html',
  styleUrls: ['./gerenciar-mercados.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class GerenciarMercadosPage {
  private toastCtrl = inject(ToastController);
  private mercadoSvc = inject(MercadoService);
  private auth = inject(AuthService);


  modalAberto = false;
  modoEdicao = false;
  buscandoCep = false;
  filtroNome = '';
  filtroStatus = 'todos';
  imagemPreview: string | null = null;
  carregando = true;

  mercados: Mercado[] = [];
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

  async ionViewWillEnter() {
    await this.carregarMercados();
  }

  async carregarMercados() {
    this.carregando = true;
    this.mercados = await this.mercadoSvc.listar();
    this.carregando = false;
  }

  novoMercado(): Mercado {
    return {
      id: 0, nome: '', cidade: '', status: 'pendente', responsavel: '',
      cnpj: '', telefone: '', email: '', cep: '', rua: '', numero: '',
      complemento: '', bairro: '', estado: '',
      admin_nome: '', admin_cpf: '', admin_email: '', admin_telefone: '', admin_senha: '',
      logo_url: '', latitude: 0, longitude: 0, endereco: ''
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

  async alterarStatus(m: Mercado, novoStatus: 'aprovado' | 'pendente' | 'desativado') {
    const token = this.auth.usuario?.token;
    if (!token) return;
    const ok = await this.mercadoSvc.atualizar(m.id, { ...m, status: novoStatus }, token);
    if (ok) {
      m.status = novoStatus;
      await this.toast(`Mercado ${novoStatus === 'aprovado' ? 'aprovado' : novoStatus === 'desativado' ? 'desativado' : 'pendente'}!`, 'success');
    } else {
      await this.toast('Erro ao alterar status!', 'danger');
    }
  }

  async excluir(m: Mercado) {
    const token = this.auth.usuario?.token;
    if (!token) return;
    const ok = await this.mercadoSvc.excluir(m.id, token);
    if (ok) {
      this.mercados = this.mercados.filter(x => x.id !== m.id);
      await this.toast('Mercado excluído!', 'danger');
    } else {
      await this.toast('Erro ao excluir!', 'danger');
    }
  }

  async salvar() {
    if (!this.mercadoSelecionado.nome || !this.mercadoSelecionado.cnpj) {
      await this.toast('Preencha os campos obrigatórios!', 'warning');
      return;
    }
    const token = this.auth.usuario?.token;
    if (!token) {
      await this.toast('Sessão expirada!', 'danger');
      return;
    }
    if (this.modoEdicao) {
      const ok = await this.mercadoSvc.atualizar(this.mercadoSelecionado.id, this.mercadoSelecionado, token);
      if (ok) {
        await this.carregarMercados();
        await this.toast('Mercado atualizado!', 'success');
      } else {
        await this.toast('Erro ao atualizar!', 'danger');
      }
    } else {
      const ok = await this.mercadoSvc.criar(this.mercadoSelecionado, token);
      if (ok) {
        await this.carregarMercados();
        await this.toast('Mercado cadastrado!', 'success');
      } else {
        await this.toast('Erro ao cadastrar!', 'danger');
      }
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

  async onImagemSelecionada(event: any) {
    const file = event.target.files[0] as File;
    if (!file) return;
    this.imagemPreview = URL.createObjectURL(file);

    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(async blob => {
        if (!blob) return;
        const formData = new FormData();
        formData.append('file', blob, `${Date.now()}.webp`);
        formData.append('token', this.auth.usuario?.token || '');
        formData.append('folder', 'mercados');
        try {
          const res = await fetch(`${environment.apiUrl}/api/upload`, {
            method: 'POST', body: formData,
          });
          const data = await res.json();
          if (data.url) {
            this.imagemPreview = data.url;
            this.mercadoSelecionado.logo_url = data.url;
          }
        } catch {}
      }, 'image/webp', 0.8);
    };
    img.src = this.imagemPreview;
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }

  statusLabel(s: string) {
    return s === 'aprovado' ? 'Aprovado' : s === 'pendente' ? 'Pendente' : 'Desativado';
  }
}
