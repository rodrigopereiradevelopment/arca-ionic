
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
    public carrinhoService: CarrinhoService,  // ✨ Mudou de private para public
    private comparacaoService: ComparacaoService,
    private toastCtrl: ToastController
  ) {}

  ionViewWillEnter() {
    this.produtos = this.carrinhoService.lista;
  }

  // ✨ NOVO: Aumentar quantidade
  incrementar(id: number) {
    this.carrinhoService.incrementar(id);
    this.produtos = this.carrinhoService.lista;
  }

  // ✨ NOVO: Diminuir quantidade
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

  // ✨ MELHORADO: Comparação com quantidade
  compararPrecos() {
    this.comparacaoService.limpar();
    
    // Passa produtos COM quantidade
    this.produtos.forEach(p => {
      this.comparacaoService.adicionar({
        id: p.id,
        nome: p.nome,
        img: p.img,
        menorPreco: p.menorPreco,
        mercadoMaisBarato: p.mercadoMaisBarato,
        quantidade: p.quantidade  // ✨ Envia quantidade!
      });
    });
    
    console.log('✅ Comparação iniciada com quantidades:');
    this.produtos.forEach(p => {
      console.log(`  ${p.nome}: ${p.quantidade}x`);
    });
  }

  async limparTudo() {
    this.carrinhoService.limpar();
    this.comparacaoService.limpar();
    this.produtos = [];
    const t = await this.toastCtrl.create({ 
      message: 'Lista limpa!', 
      duration: 2000, 
      color: 'medium', 
      position: 'top' 
    });
    await t.present();
  }
}