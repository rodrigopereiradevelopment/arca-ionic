import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemLista {
  id: number;
  nome: string;
  img: string;
  menorPreco: number;
  mercadoMaisBarato: string;
  quantidade: number;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {

  private itens = new BehaviorSubject<ItemLista[]>([]);

  itens$ = this.itens.asObservable();

  get lista() { return this.itens.getValue(); }

  adicionar(item: Omit<ItemLista, 'quantidade'>) {
    const atual = this.itens.getValue();
    const existente = atual.find(i => i.id === item.id);
    if (existente) {
      this.itens.next(atual.map(i => i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i));
    } else {
      this.itens.next([...atual, { ...item, quantidade: 1 }]);
    }
  }

  incrementar(id: number) {
    this.itens.next(this.lista.map(i => i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i));
  }

  decrementar(id: number) {
    const item = this.lista.find(i => i.id === id);
    if (!item) return;
    if (item.quantidade <= 1) {
      this.remover(id);
    } else {
      this.itens.next(this.lista.map(i => i.id === id ? { ...i, quantidade: i.quantidade - 1 } : i));
    }
  }

  remover(id: number) {
    this.itens.next(this.lista.filter(i => i.id !== id));
  }

  contem(id: number) {
    return this.lista.some(i => i.id === id);
  }

  limpar() {
    this.itens.next([]);
  }

  get total() {
    return this.lista.reduce((acc, i) => acc + (i.menorPreco * i.quantidade), 0);
  }
}
