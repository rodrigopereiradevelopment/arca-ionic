import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonSpinner, ToastController, AlertController } from '@ionic/angular/standalone';
import { TicketService, Ticket, TicketMensagem } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonSpinner]
})
export class TicketPage {
  private ticketService = inject(TicketService);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);

  modalAberto = false;
  loading = true;
  tickets: Ticket[] = [];
  ticketAberto: Ticket | null = null;
  mensagens: TicketMensagem[] = [];
  novaMensagem = '';
  filtroAtivo: 'todos' | 'aberto' | 'analise' | 'resolvido' = 'todos';

  novoTicket = { tipo: 'duvida' as Ticket['tipo'], titulo: '', descricao: '' };

  tipos = [
    { value: 'preco', label: '🏷️ Preço Incorreto' },
    { value: 'mercado', label: '🏪 Mercado Incorreto' },
    { value: 'bug', label: '🐛 Bug no App' },
    { value: 'sugestao', label: '💡 Sugestão' },
    { value: 'duvida', label: '❓ Dúvida Geral' }
  ];

  async ionViewWillEnter() {
    this.loading = true;
    await this.carregar();
    this.loading = false;
  }

  private async carregar() {
    const res = await this.ticketService.listar();
    if (res) this.tickets = res.data;
  }

  get ticketsFiltrados() {
    return this.tickets
      .filter(t => this.filtroAtivo === 'todos' || t.status === this.filtroAtivo)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  get precisaFoto() {
    return this.novoTicket.tipo === 'preco' || this.novoTicket.tipo === 'mercado';
  }

  async abrirTicket(t: Ticket) {
    this.ticketAberto = t;
    this.mensagens = [];
    const msgs = await this.ticketService.listarMensagens(t.id);
    if (msgs) this.mensagens = msgs;
  }

  fecharTicket() {
    this.ticketAberto = null;
    this.mensagens = [];
    this.novaMensagem = '';
  }

  async enviarMensagem() {
    if (!this.novaMensagem.trim() || !this.ticketAberto) return;
    const msg = await this.ticketService.enviarMensagem(this.ticketAberto.id, this.novaMensagem.trim());
    if (msg) {
      this.mensagens.push(msg);
      this.novaMensagem = '';
    } else {
      this.mostrarToast('Erro ao enviar mensagem', 'danger');
    }
  }

  async abrirNovoTicket() {
    this.novoTicket = { tipo: 'duvida', titulo: '', descricao: '' };
    this.modalAberto = true;
  }

  async enviarTicket() {
    if (!this.novoTicket.titulo || !this.novoTicket.descricao) {
      this.mostrarToast('Preencha todos os campos!', 'warning');
      return;
    }
    const ticket = await this.ticketService.criar(this.novoTicket.tipo, this.novoTicket.titulo, this.novoTicket.descricao);
    if (ticket) {
      this.tickets.unshift(ticket);
      this.modalAberto = false;
      this.mostrarToast('Ticket aberto com sucesso! ✅', 'success');
    } else {
      this.mostrarToast('Erro ao criar ticket', 'danger');
    }
  }

  async confirmarFechar(t: Ticket) {
    const alert = await this.alertCtrl.create({
      header: 'Fechar Ticket',
      message: 'Deseja marcar este ticket como resolvido?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Resolver', handler: async () => {
            const updated = await this.ticketService.atualizarStatus(t.id, 'resolvido');
            if (updated) {
              t.status = 'resolvido';
              this.fecharTicket();
              this.mostrarToast('Ticket marcado como resolvido!', 'success');
            } else {
              this.mostrarToast('Erro ao fechar ticket', 'danger');
            }
          }
        }
      ]
    });
    await alert.present();
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

  formatarData(dataStr: string): string {
    const data = new Date(dataStr);
    const diff = Date.now() - data.getTime();
    const min = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (min < 1) return 'Agora mesmo';
    if (min < 60) return `${min} min atrás`;
    if (h < 24) return `${h}h atrás`;
    if (d === 1) return 'Ontem';
    return `${d} dias atrás`;
  }

  private async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }
}
