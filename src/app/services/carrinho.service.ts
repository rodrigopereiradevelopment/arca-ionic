import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemLista {
  id: number;
  nome: string;
  img: string;
  menorPreco: number;
  mercadoMaisBarato: string;
  quantidade: number;
  precosPorMercado: { [mercado: string]: number }; // ← adicionado
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private readonly KEY = 'arca_carrinho';
  private itens = new BehaviorSubject<ItemLista[]>(this.carregar());
  itens$ = this.itens.asObservable();

  get lista() { return this.itens.getValue(); }

  private carregar(): ItemLista[] {
    try {
      const salvo = localStorage.getItem(this.KEY);
      return salvo ? JSON.parse(salvo) : [];
    } catch { return []; }
  }

  private salvar() {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(this.itens.getValue()));
    } catch {}
  }

  adicionar(item: Omit<ItemLista, 'quantidade'>) {
    const atual = this.itens.getValue();
    const existente = atual.find(i => i.id === item.id);
    if (existente) {
      this.itens.next(atual.map(i => i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i));
    } else {
      this.itens.next([...atual, { ...item, quantidade: 1 }]);
    }
    this.salvar();
  }

  incrementar(id: number) {
    this.itens.next(this.lista.map(i => i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i));
    this.salvar();
  }

  decrementar(id: number) {
    const item = this.lista.find(i => i.id === id);
    if (!item) return;
    if (item.quantidade <= 1) {
      this.remover(id);
    } else {
      this.itens.next(this.lista.map(i => i.id === id ? { ...i, quantidade: i.quantidade - 1 } : i));
      this.salvar();
    }
  }

  remover(id: number) {
    this.itens.next(this.lista.filter(i => i.id !== id));
    this.salvar();
  }

  contem(id: number) {
    return this.lista.some(i => i.id === id);
  }

  limpar() {
    this.itens.next([]);
    this.salvar();
  }

  get total() {
    return this.lista.reduce((acc, i) => acc + (i.menorPreco * i.quantidade), 0);
  }

  // ← dentro da classe agora
  get comparacaoMercados() {
    const totais: { [mercado: string]: { total: number; itens: number } } = {};

    for (const item of this.lista) {
      for (const [mercado, preco] of Object.entries(item.precosPorMercado ?? {})) {
        if (!totais[mercado]) totais[mercado] = { total: 0, itens: 0 };
        totais[mercado].total += (preco as number) * item.quantidade;
        totais[mercado].itens += 1;
      }
    }

    return Object.entries(totais)
      .map(([mercado, d]) => ({ mercado, total: d.total, itens: d.itens }))
      .sort((a, b) => a.total - b.total);
  }
}