import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { CarrinhoService, ItemLista } from '../../services/carrinho.service';
import { ComparacaoService } from '../../services/comparacao.service';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent]
})
export class CarrinhoPage {
  produtos: ItemLista[] = [];

  constructor(
    private carrinhoService: CarrinhoService,
    private comparacaoService: ComparacaoService,
    private toastCtrl: ToastController
  ) {}

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
    this.carrinhoService.remover(id);
    this.comparacaoService.remover(id);
    this.produtos = this.carrinhoService.lista;
  }

  get total() {
    return this.carrinhoService.total;
  }

  compararPrecos() {
    this.comparacaoService.limpar();
    this.produtos.forEach(p => this.comparacaoService.adicionar(p));
  }

  async limparTudo() {
    this.carrinhoService.limpar();
    this.comparacaoService.limpar();
    this.produtos = [];
    const t = await this.toastCtrl.create({ message: 'Lista limpa!', duration: 2000, color: 'medium', position: 'top' });
    await t.present();
  }
}
