import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController, AlertController } from '@ionic/angular/standalone';

interface Mensagem {
  autor: 'usuario' | 'suporte';
  texto: string;
  data: Date;
}

interface Ticket {
  id: number;
  tipo: 'preco' | 'mercado' | 'bug' | 'sugestao' | 'duvida';
  titulo: string;
  descricao: string;
  status: 'aberto' | 'analise' | 'resolvido';
  data: Date;
  mensagens: Mensagem[];
  imagemAnexo?: string;
}

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class TicketPage implements OnInit {

  modalAberto = false;
  ticketAberto: Ticket | null = null;
  novaMensagem = '';
  imagemPreview: string | null = null;
  filtroAtivo: 'todos' | 'aberto' | 'analise' | 'resolvido' = 'todos';

  novoTicket = {
    tipo: 'duvida' as Ticket['tipo'],
    titulo: '',
    descricao: ''
  };

  tipos = [
    { value: 'preco', label: '🏷️ Preço Incorreto' },
    { value: 'mercado', label: '🏪 Mercado Incorreto' },
    { value: 'bug', label: '🐛 Bug no App' },
    { value: 'sugestao', label: '💡 Sugestão' },
    { value: 'duvida', label: '❓ Dúvida Geral' }
  ];

  tickets: Ticket[] = [
    {
      id: 1, tipo: 'preco',
      titulo: 'Preço do Café errado no Big Bom',
      descricao: 'O preço mostrado é R$ 18,90 mas na prateleira está R$ 21,50.',
      status: 'analise',
      data: new Date(Date.now() - 86400000),
      mensagens: [
        { autor: 'usuario', texto: 'O preço mostrado é R$ 18,90 mas na prateleira está R$ 21,50.', data: new Date(Date.now() - 86400000) },
        { autor: 'suporte', texto: 'Obrigado por reportar! Estamos verificando com o mercado.', data: new Date(Date.now() - 3600000) }
      ]
    },
    {
      id: 2, tipo: 'sugestao',
      titulo: 'Adicionar filtro por promoção',
      descricao: 'Seria útil filtrar apenas produtos em promoção.',
      status: 'aberto',
      data: new Date(Date.now() - 172800000),
      mensagens: [
        { autor: 'usuario', texto: 'Seria útil filtrar apenas produtos em promoção.', data: new Date(Date.now() - 172800000) }
      ]
    },
    {
      id: 3, tipo: 'bug',
      titulo: 'Mapa não carrega às vezes',
      descricao: 'O mapa de rotas fica em branco quando abre pela segunda vez.',
      status: 'resolvido',
      data: new Date(Date.now() - 604800000),
      mensagens: [
        { autor: 'usuario', texto: 'O mapa fica em branco quando abre pela segunda vez.', data: new Date(Date.now() - 604800000) },
        { autor: 'suporte', texto: 'Corrigido na versão 1.2! Obrigado pelo reporte.', data: new Date(Date.now() - 86400000) }
      ]
    }
  ];

  get ticketsFiltrados() {
    return this.tickets
      .filter(t => this.filtroAtivo === 'todos' || t.status === this.filtroAtivo)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  get precisaFoto() {
    return this.novoTicket.tipo === 'preco' || this.novoTicket.tipo === 'mercado';
  }

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  abrirTicket(t: Ticket) {
    this.ticketAberto = t;
  }

  fecharTicket() {
    this.ticketAberto = null;
    this.novaMensagem = '';
  }

  async enviarMensagem() {
    if (!this.novaMensagem.trim() || !this.ticketAberto) return;
    this.ticketAberto.mensagens.push({
      autor: 'usuario',
      texto: this.novaMensagem.trim(),
      data: new Date()
    });
    this.novaMensagem = '';
    const t = await this.toastCtrl.create({
      message: 'Mensagem enviada!', duration: 2000,
      color: 'success', position: 'top'
    });
    await t.present();
  }

  async abrirNovoTicket() {
    this.novoTicket = { tipo: 'duvida', titulo: '', descricao: '' };
    this.imagemPreview = null;
    this.modalAberto = true;
  }

  async enviarTicket() {
    if (!this.novoTicket.titulo || !this.novoTicket.descricao) {
      await this.toastCtrl.create({
        message: 'Preencha todos os campos!',
        duration: 2000, color: 'warning', position: 'top'
      }).then(t => t.present());
      return;
    }
    const novo: Ticket = {
      id: Date.now(),
      tipo: this.novoTicket.tipo,
      titulo: this.novoTicket.titulo,
      descricao: this.novoTicket.descricao,
      status: 'aberto',
      data: new Date(),
      mensagens: [{
        autor: 'usuario',
        texto: this.novoTicket.descricao,
        data: new Date()
      }],
      imagemAnexo: this.imagemPreview || undefined
    };
    this.tickets.unshift(novo);
    this.modalAberto = false;
    await this.toastCtrl.create({
      message: 'Ticket aberto com sucesso! ✅',
      duration: 3000, color: 'success', position: 'top'
    }).then(t => t.present());
  }

  async confirmarFechar(t: Ticket) {
    const alert = await this.alertCtrl.create({
      header: 'Fechar Ticket',
      message: 'Deseja marcar este ticket como resolvido?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Resolver', handler: async () => {
            t.status = 'resolvido';
            this.fecharTicket();
            const toast = await this.toastCtrl.create({
              message: 'Ticket marcado como resolvido!',
              duration: 2000, color: 'success', position: 'top'
            });
            await toast.present();
          }
        }
      ]
    });
    await alert.present();
  }

  onImagemSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagemPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  tipoLabel(tipo: string) {
    return this.tipos.find(t => t.value === tipo)?.label || tipo;
  }

  statusLabel(s: string) {
    if (s === 'aberto') return 'Aberto';
    if (s === 'analise') return 'Em Análise';
    return 'Resolvido';
  }

  statusCor(s: string) {
    if (s === 'aberto') return 'badge-aberto';
    if (s === 'analise') return 'badge-analise';
    return 'badge-resolvido';
  }

  formatarData(data: Date): string {
    const diff = new Date().getTime() - new Date(data).getTime();
    const min = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (min < 1) return 'Agora mesmo';
    if (min < 60) return `${min} min atrás`;
    if (h < 24) return `${h}h atrás`;
    if (d === 1) return 'Ontem';
    return `${d} dias atrás`;
  }
}
