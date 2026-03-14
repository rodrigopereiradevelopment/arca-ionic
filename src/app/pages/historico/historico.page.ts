import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IonContent, ToastController, AlertController } from '@ionic/angular/standalone';
import { HistoricoService, ItemHistorico } from '../../services/historico.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent]
})
export class HistoricoPage implements OnInit {

  filtroAtivo: 'todos' | 'pesquisa' | 'comparacao' | 'rota' = 'todos';

  constructor(
    public historicoService: HistoricoService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  get itensFiltrados() {
    const lista = this.historicoService.lista;
    if (this.filtroAtivo === 'todos') return lista;
    return lista.filter(i => i.tipo === this.filtroAtivo);
  }

  navegarPara(item: ItemHistorico) {
    if (item.rota) this.router.navigate([item.rota]);
  }

  async remover(item: ItemHistorico) {
    this.historicoService.remover(item.id);
    const t = await this.toastCtrl.create({
      message: 'Item removido do histórico!',
      duration: 2000, color: 'warning', position: 'top'
    });
    await t.present();
  }

  async confirmarLimpar() {
    const alert = await this.alertCtrl.create({
      header: 'Limpar Histórico',
      message: 'Deseja apagar todo o histórico?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Limpar', role: 'destructive',
          handler: async () => {
            this.historicoService.limpar();
            const t = await this.toastCtrl.create({
              message: 'Histórico limpo!',
              duration: 2000, color: 'danger', position: 'top'
            });
            await t.present();
          }
        }
      ]
    });
    await alert.present();
  }

  formatarData(data: Date): string {
    const agora = new Date();
    const diff = agora.getTime() - new Date(data).getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);
    if (minutos < 1) return 'Agora mesmo';
    if (minutos < 60) return `${minutos} min atrás`;
    if (horas < 24) return `${horas}h atrás`;
    if (dias === 1) return 'Ontem';
    return `${dias} dias atrás`;
  }

  corTipo(tipo: string) {
    if (tipo === 'pesquisa') return '#e3f2fd';
    if (tipo === 'comparacao') return '#d4edda';
    return '#fff3cd';
  }
}
