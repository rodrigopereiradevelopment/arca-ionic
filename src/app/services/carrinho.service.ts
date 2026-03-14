import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemLista {
  id: number;
  nome: string;
  img: string;
  menorPreco: number;
  mercadoMaisBarato: string;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {

  private itens = new BehaviorSubject<ItemLista[]>([
    { id: 1, nome: 'Café Tradicional 3 Corações', img: 'assets/img/Produto 1.png', menorPreco: 18.90, mercadoMaisBarato: 'Big Bom' },
    { id: 2, nome: 'Açúcar Refinado União', img: 'assets/img/Produto 2.png', menorPreco: 4.99, mercadoMaisBarato: 'SMC' }
  ]);

  itens$ = this.itens.asObservable();

  get lista() { return this.itens.getValue(); }

  adicionar(item: ItemLista) {
    const atual = this.itens.getValue();
    if (!atual.find(i => i.id === item.id)) {
      this.itens.next([...atual, item]);
    }
  }

  remover(id: number) {
    this.itens.next(this.itens.getValue().filter(i => i.id !== id));
  }

  contem(id: number) {
    return this.itens.getValue().some(i => i.id === id);
  }

  get total() {
    return this.lista.reduce((acc, i) => acc + i.menorPreco, 0);
  }
}
