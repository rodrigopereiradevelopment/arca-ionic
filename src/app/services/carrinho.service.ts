
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemLista {
  id: number;
  nome: string;
  img: string;
  menorPreco: number;
  mercadoMaisBarato: string;
  quantidade: number;  // ✨ NOVO
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {

  private itens = new BehaviorSubject<ItemLista[]>([]);

  itens$ = this.itens.asObservable();

  get lista() { return this.itens.getValue(); }

  // ✨ Adicionar com quantidade
  adicionar(item: ItemLista) {
    const atual = this.itens.getValue();
    const existe = atual.find(i => i.id === item.id);

    if (existe) {
      // Se já existe, aumenta quantidade
      this.itens.next(
        atual.map(i =>
          i.id === item.id
            ? { ...i, quantidade: i.quantidade + (item.quantidade || 1) }
            : i
        )
      );
    } else {
      // Novo item (com quantidade padrão 1 se não informar)
      this.itens.next([...atual, { ...item, quantidade: item.quantidade || 1 }]);
    }
  }

  // ✨ NOVO: Aumentar quantidade
  incrementar(id: number) {
    this.itens.next(
      this.lista.map(i =>
        i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i
      )
    );
  }

  // ✨ NOVO: Diminuir quantidade
  decrementar(id: number) {
    this.itens.next(
      this.lista
        .map(i =>
          i.id === id && i.quantidade > 1
            ? { ...i, quantidade: i.quantidade - 1 }
            : i
        )
        .filter(i => i.quantidade > 0) // Remove se quantidade chegar a 0
    );
  }

  // ✨ NOVO: Definir quantidade específica
  definirQuantidade(id: number, quantidade: number) {
    if (quantidade <= 0) {
      this.remover(id);
      return;
    }
    this.itens.next(
      this.lista.map(i =>
        i.id === id ? { ...i, quantidade } : i
      )
    );
  }

  remover(id: number) {
    this.itens.next(this.itens.getValue().filter(i => i.id !== id));
  }

  contem(id: number) {
    return this.itens.getValue().some(i => i.id === id);
  }

  limpar() {
    this.itens.next([]);
  }

  // ✨ MELHORADO: Total multiplicado por quantidade
  get total() {
    return this.lista.reduce((acc, i) => acc + (i.menorPreco * i.quantidade), 0);
  }

  // ✨ NOVO: Contar itens (soma de quantidades)
  get quantidadeTotal() {
    return this.lista.reduce((acc, i) => acc + i.quantidade, 0);
  }

  // ✨ NOVO: Contar produtos diferentes
  get quantidadeProdutos() {
    return this.lista.length;
  }
}