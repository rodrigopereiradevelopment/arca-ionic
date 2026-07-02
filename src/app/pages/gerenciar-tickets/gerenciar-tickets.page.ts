import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonButton, IonIcon, IonList, IonItem,
  IonLabel, IonChip, IonBadge, IonSegment, IonSegmentButton,
  IonSpinner, IonRefresher, IonRefresherContent, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ticket, arrowBack, checkmark, refresh } from 'ionicons/icons';
import { TicketService, Ticket } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gerenciar-tickets',
  templateUrl: './gerenciar-tickets.page.html',
  styleUrls: ['./gerenciar-tickets.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
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

  constructor() {
    addIcons({ ticket, arrowBack, checkmark, refresh });
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

  private async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color, position: 'top' });
    await t.present();
  }
}
