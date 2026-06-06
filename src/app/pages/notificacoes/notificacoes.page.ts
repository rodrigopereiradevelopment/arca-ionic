import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonSpinner, AlertController, ToastController } from '@ionic/angular/standalone';
import { NotificacaoService, Notificacao } from '../../services/notificacao.service';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.page.html',
  styleUrls: ['./notificacoes.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonSpinner]
})
export class NotificacoesPage {
  private notifService = inject(NotificacaoService);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  filtroAtivo: 'todas' | 'alerta_preco' | 'promocao' | 'sistema' | 'marketing' = 'todas';

  notificacoes: Notificacao[] = [];
  naoLidas = 0;
  loading = true;

  async ionViewWillEnter() {
    this.loading = true;
    await this.carregar();
    this.loading = false;
  }

  private async carregar() {
    const res = await this.notifService.listar();
    if (res) {
      this.notificacoes = res.data;
      this.naoLidas = res.naoLidas;
    }
  }

  get notificacoesFiltradas() {
    if (this.filtroAtivo === 'todas') return this.notificacoes;
    return this.notificacoes.filter(n => n.tipo === this.filtroAtivo);
  }

  async marcarLida(n: Notificacao) {
    if (n.lida) return;
    const ok = await this.notifService.marcarLida(n.id);
    if (ok) {
      n.lida = true;
      n.data_leitura = new Date().toISOString();
      this.naoLidas = Math.max(0, this.naoLidas - 1);
    }
  }

  async marcarTodasLidas() {
    const ok = await this.notifService.marcarTodasLidas();
    if (ok) {
      this.notificacoes.forEach(n => { n.lida = true; n.data_leitura = new Date().toISOString(); });
      this.naoLidas = 0;
    }
  }

  async remover(n: Notificacao) {
    const ok = await this.notifService.remover(n.id);
    if (ok) {
      if (!n.lida) this.naoLidas = Math.max(0, this.naoLidas - 1);
      this.notificacoes = this.notificacoes.filter(x => x.id !== n.id);
    }
  }

  async confirmarLimpar() {
    const alert = await this.alertCtrl.create({
      header: 'Limpar Notificações',
      message: 'Deseja apagar todas as notificações?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Limpar', role: 'destructive',
          handler: async () => {
            const ok = await this.notifService.limparTodas();
            if (ok) {
              this.notificacoes = [];
              this.naoLidas = 0;
            }
            const t = await this.toastCtrl.create({
              message: ok ? 'Notificações limpas!' : 'Erro ao limpar',
              duration: 2000, color: ok ? 'warning' : 'danger', position: 'top'
            });
            await t.present();
          }
        }
      ]
    });
    await alert.present();
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

  corTipo(tipo: string) {
    if (tipo === 'alerta_preco') return '#d4edda';
    if (tipo === 'promocao') return '#fff3cd';
    if (tipo === 'marketing') return '#e3f2fd';
    return '#f5f5f5';
  }

  iconeTipo(tipo: string) {
    if (tipo === 'alerta_preco') return '💰';
    if (tipo === 'promocao') return '🏷️';
    if (tipo === 'marketing') return '📱';
    return '🔔';
  }
}
