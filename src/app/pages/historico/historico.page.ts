import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IonContent, IonSpinner, ToastController, AlertController } from '@ionic/angular/standalone';
import { HistoricoService, ItemHistorico } from '../../services/historico.service';
import { FavoritoService, Favorito } from '../../services/favorito.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonSpinner]
})
export class HistoricoPage {
  private historicoService = inject(HistoricoService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  favoritoService = inject(FavoritoService);

  filtroAtivo: 'todos' | 'pesquisa' | 'comparacao' | 'rota' | 'favoritos' = 'todos';
  loading = true;
  itens: ItemHistorico[] = [];
  favoritos: Favorito[] = [];

  async ionViewWillEnter() {
    if (this.router.url.startsWith('/favoritos')) {
      this.filtroAtivo = 'favoritos';
      await this.carregarFavoritos();
    } else {
      await this.carregarHistorico();
    }
  }

  private async carregarHistorico() {
    this.loading = true;
    this.historicoService.itens$.subscribe(lista => {
      this.itens = lista;
      this.loading = false;
    });
    await this.historicoService.recarregar();
  }

  private async carregarFavoritos() {
    this.loading = true;
    this.favoritos = await this.favoritoService.listar();
    this.loading = false;
  }

  setFiltro(f: typeof this.filtroAtivo) {
    this.filtroAtivo = f;
    if (f === 'favoritos') {
      this.carregarFavoritos();
    } else if (this.itens.length === 0) {
      this.carregarHistorico();
    }
  }

  get itensFiltrados() {
    if (this.filtroAtivo === 'todos') return this.itens;
    return this.itens.filter(i => i.tipo === this.filtroAtivo);
  }

  navegarPara(item: ItemHistorico) {
    if (item.rota) this.router.navigate([item.rota]);
  }

  async remover(item: ItemHistorico) {
    await this.historicoService.remover(item.id);
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
            await this.historicoService.limpar();
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

  async desfavoritar(f: Favorito) {
    await this.favoritoService.remover(f.produto_id);
    this.favoritos = this.favoritos.filter(x => x.produto_id !== f.produto_id);
    const t = await this.toastCtrl.create({
      message: 'Removido dos favoritos!',
      duration: 2000, color: 'warning', position: 'top'
    });
    await t.present();
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
