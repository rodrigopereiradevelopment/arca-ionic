import { Component, inject } from '@angular/core';
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
export class ModalCarrinhoComponent {
  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  carrinhoService = inject(CarrinhoService);

  view: string = 'lista';
  comparacaoMercados: MercadoComparacao[] = [];

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
  const itens = this.carrinhoService.lista;
  if (itens.length === 0) return;

  try {
    const produtosPayload = itens.map(item => ({
      id: item.id,
      nome: item.nome,
      quantidade: item.quantidade || 1
    }));

    const res = await fetch(`${environment.apiUrl}/api/comparar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ produtos: produtosPayload })
    });

    const data = await res.json();

    if (data.sucesso && data.mercados) {
      this.comparacaoMercados = data.mercados
        .filter((m: any) => m.total > 0)
        .map((m: any) => ({
          id: m.id,
          mercado: m.nome,
          total: m.total,
          itens: m.itensEncontrados
        }));
    }
  } catch (err) {
    console.error('Erro na comparação:', err);
  }
}

async toggleComparacao() {
  if (this.view === 'lista') {
    await this.carregarComparacao();
  }
  this.view = this.view === 'lista' ? 'resultado' : 'lista';
}
}