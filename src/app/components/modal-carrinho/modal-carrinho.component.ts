import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  IonButton, IonContent, IonList, IonItem,
  IonLabel, IonCard, IonCardContent, ModalController
} from '@ionic/angular/standalone';
import { CarrinhoService } from '../../services/carrinho.service';
import { environment } from '../../../environments/environment';

interface MercadoComparacao {
  id: number;
  mercado: string;
  total: number;
  itens: number;
}

@Component({
  selector: 'app-modal-carrinho',
  templateUrl: './modal-carrinho.component.html',
  styleUrls: ['./modal-carrinho.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonButton, IonContent, IonList, IonItem,
    IonLabel, IonCard, IonCardContent
  ]
})
export class ModalCarrinhoComponent implements OnInit {

  view: string = 'lista';
  comparacaoMercados: MercadoComparacao[] = [];

  private readonly SUPERMERCADOS: Record<number, string> = {
    1: 'GoodBom',
    2: 'PagueMenos',
    3: 'São Vicente',
    4: 'Atacadão',
    5: 'Imperial',
    6: 'Ponto Novo'
  };

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    public carrinhoService: CarrinhoService
  ) {}

  ngOnInit() {}

  fecharModal() { 
    this.modalCtrl.dismiss(); 
  }

  remover(id: number) { 
    this.carrinhoService.remover(id); 
  }
  
  incrementar(id: number) { 
    this.carrinhoService.incrementar(id); 
  }
  
  decrementar(id: number) { 
    this.carrinhoService.decrementar(id); 
  }

  verRotas() {
    this.modalCtrl.dismiss();
    this.router.navigate(['/mapa-rotas']);
  }

  async carregarComparacao() {
    // Pega os itens atuais via subscribe
    this.carrinhoService.itens$.subscribe(async (itens) => {
      if (itens.length === 0) return;

      const resultados: MercadoComparacao[] = [];

      for (const [id, nome] of Object.entries(this.SUPERMERCADOS)) {
        const mercadoId = Number(id);
        let total = 0;
        let itensEncontrados = 0;

        for (const item of itens) {
          const preco = await this.buscarPrecoProduto(item.id, mercadoId);
          if (preco > 0) {
            total += preco * item.quantidade;
            itensEncontrados++;
          }
        }

        resultados.push({
          id: mercadoId,
          mercado: nome,
          total: total,
          itens: itensEncontrados
        });
      }

      this.comparacaoMercados = resultados
        .filter(r => r.total > 0)
        .sort((a, b) => a.total - b.total);
    }).unsubscribe();
  }

  async buscarPrecoProduto(produtoId: number, mercadoId: number): Promise<number> {
    try {
      const res = await fetch(
        `${environment.apiUrl}/api/produtos/preco?produtoId=${produtoId}&mercadoId=${mercadoId}`
      );
      const data = await res.json();
      return data.preco || 0;
    } catch {
      return 0;
    }
  }

  async toggleComparacao() {
    if (this.view === 'resultado') {
      await this.carregarComparacao();
    }
    this.view = this.view === 'lista' ? 'resultado' : 'lista';
  }
}