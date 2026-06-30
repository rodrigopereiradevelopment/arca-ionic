import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { CarrinhoService, ItemLista } from '../../services/carrinho.service';
import { ComparacaoService } from '../../services/comparacao.service';
import { AuthService } from '../../services/auth.service';
import { HistoricoListasService, HistoricoLista } from '../../services/historico-listas.service';
import { FavoritoService } from '../../services/favorito.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent]
})
export class CarrinhoPage {
  private toastCtrl = inject(ToastController);
  private comparacaoService = inject(ComparacaoService);
  protected auth = inject(AuthService);
  protected carrinhoService = inject(CarrinhoService);
  private historicoSvc = inject(HistoricoListasService);
  protected favoritoService = inject(FavoritoService);
  private audio = inject(AudioService);

  produtos: ItemLista[] = [];
  historico: HistoricoLista[] = [];
  historicoAberto = false;
  carregandoHistorico = false;

  ionViewWillEnter() {
    this.produtos = this.carrinhoService.lista;
  }

  incrementar(id: number) {
    this.carrinhoService.incrementar(id);
    this.produtos = this.carrinhoService.lista;
  }

  decrementar(id: number) {
    this.carrinhoService.decrementar(id);
    this.produtos = this.carrinhoService.lista;
  }

  remover(id: number) {
    this.audio.play('error');
    this.carrinhoService.remover(id);
    this.comparacaoService.remover(id);
    this.produtos = this.carrinhoService.lista;
  }

  get total() {
    return this.carrinhoService.total;
  }

  compararPrecos() {
    this.comparacaoService.limpar();
    this.produtos.forEach(p => {
      this.comparacaoService.adicionar({
        id: p.id, nome: p.nome, img: p.img,
        menorPreco: p.menorPreco, mercadoMaisBarato: p.mercadoMaisBarato,
        quantidade: p.quantidade
      });
    });
  }

  async salvarLista() {
    const salva = await this.historicoSvc.salvar('Lista salva', this.produtos);
    if (salva) {
      this.audio.play('success');
      this.historico.unshift(salva);
      this.mostrarToast('Lista salva! 💾', 'success');
    } else {
      this.audio.play('error');
      this.mostrarToast('Erro ao salvar lista', 'danger');
    }
  }

  async restaurarLista(h: HistoricoLista) {
    const ok = await this.historicoSvc.restaurar(h.id);
    if (ok) {
      this.carrinhoService.carregarDoServidor();
      setTimeout(() => {
        this.produtos = this.carrinhoService.lista;
        this.mostrarToast('Lista restaurada! ↩', 'success');
      }, 500);
    } else {
      this.mostrarToast('Erro ao restaurar lista', 'danger');
    }
  }

  async excluirLista(h: HistoricoLista) {
    const ok = await this.historicoSvc.excluir(h.id);
    if (ok) {
      this.historico = this.historico.filter(x => x.id !== h.id);
      this.mostrarToast('Lista excluída', 'medium');
    }
  }

  async toggleHistorico() {
    this.historicoAberto = !this.historicoAberto;
    if (this.historicoAberto && this.historico.length === 0) {
      await this.carregarHistorico();
    }
  }

  async carregarHistorico() {
    this.carregandoHistorico = true;
    this.historico = await this.historicoSvc.listar();
    this.carregandoHistorico = false;
  }

  async limparTudo() {
    if (this.produtos.length > 0 && this.auth.logado) {
      await this.historicoSvc.salvar('Lista salva', this.produtos);
    }
    this.carrinhoService.limpar();
    this.comparacaoService.limpar();
    this.produtos = [];
    this.mostrarToast('Lista limpa!', 'medium');
  }

  private async mostrarToast(message: string, color: string) {
    const t = await this.toastCtrl.create({
      message, duration: 2000, color, position: 'top'
    });
    await t.present();
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/Produto1.png';
    img.onerror = null;
  }
}
