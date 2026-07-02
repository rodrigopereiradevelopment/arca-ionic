import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonButton, IonIcon, IonList, IonItem,
  IonLabel, IonChip, IonBadge, IonSegment, IonSegmentButton,
  IonSpinner, IonRefresher, IonRefresherContent, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ticket, arrowBack, checkmark, refresh, arrowForward } from 'ionicons/icons';
import { TicketService, Ticket, TicketMensagem } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gerenciar-tickets',
  templateUrl: './gerenciar-tickets.page.html',
  styleUrls: [],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonBackButton, IonButton, IonIcon, IonList, IonItem,
    IonLabel, IonChip, IonBadge, IonSegment, IonSegmentButton,
    IonSpinner, IonRefresher, IonRefresherContent
  ]
})
export class GerenciarTicketsPage {
  private ticketSvc = inject(TicketService);
  private auth = inject(AuthService);
  private toastCtrl = inject(ToastController);

  tickets: Ticket[] = [];
  loading = true;
  filtro = 'todos';

  ticketAberto: Ticket | null = null;
  mensagens: TicketMensagem[] = [];
  textoResposta = '';
  carregandoMsgs = false;

  constructor() {
    addIcons({ ticket, arrowBack, checkmark, refresh, arrowForward });
  }

  async ionViewWillEnter() {
    await this.carregar();
  }

  async carregar(event?: any) {
    this.loading = !event;
    this.tickets = (await this.ticketSvc.listar(1, 100))?.data || [];
    this.loading = false;
    if (event) event.target.complete();
  }

  get filtrados(): Ticket[] {
    if (this.filtro === 'todos') return this.tickets;
    return this.tickets.filter(t => t.status === this.filtro);
  }

  corStatus(s: string): string {
    if (s === 'aberto') return 'danger';
    if (s === 'analise') return 'warning';
    return 'success';
  }

  labelTipo(t: string): string {
    const map: Record<string, string> = {
      preco: 'Preço', mercado: 'Mercado', bug: 'Bug',
      sugestao: 'Sugestão', duvida: 'Dúvida'
    };
    return map[t] || t;
  }

  async alterarStatus(ticket: Ticket, novoStatus: string) {
    const ok = await this.ticketSvc.atualizarStatus(ticket.id, novoStatus);
    if (ok) {
      ticket.status = novoStatus as Ticket['status'];
      await this.toast(`Ticket alterado para "${novoStatus}"`, 'success');
    } else {
      await this.toast('Erro ao alterar status', 'danger');
    }
  }

  async abrirConversa(t: Ticket) {
    this.ticketAberto = t;
    this.mensagens = [];
    this.carregandoMsgs = true;
    const msgs = await this.ticketSvc.listarMensagens(t.id);
    if (msgs) this.mensagens = msgs;
    this.carregandoMsgs = false;
  }

  fecharConversa() {
    this.ticketAberto = null;
    this.mensagens = [];
    this.textoResposta = '';
  }

  async responder() {
    if (!this.textoResposta.trim() || !this.ticketAberto) return;
    const msg = await this.ticketSvc.enviarMensagem(this.ticketAberto.id, this.textoResposta.trim());
    if (msg) {
      this.mensagens.push(msg);
      this.textoResposta = '';
    } else {
      await this.toast('Erro ao enviar resposta', 'danger');
    }
  }

  formatarData(dataStr: string): string {
    const data = new Date(dataStr);
    const diff = Date.now() - data.getTime();
    const min = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (min < 1) return 'Agora';
    if (min < 60) return `${min}min`;
    if (h < 24) return `${h}h`;
    if (d === 1) return 'Ontem';
    return `${d}d`;
  }

  private async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color, position: 'top' });
    await t.present();
  }
}
