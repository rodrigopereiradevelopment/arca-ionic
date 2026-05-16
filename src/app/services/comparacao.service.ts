import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ComparacaoService {
  private produtos: any[] = [];

  adicionar(produto: any) {
    if (!this.produtos.find(p => p.id === produto.id)) {
      this.produtos.push(produto);
    }
  }

  remover(id: number) {
    this.produtos = this.produtos.filter(p => p.id !== id);
  }

  getProdutos(): any[] { return this.produtos; }
  contem(id: number): boolean { return !!this.produtos.find(p => p.id === id); }
  limpar() { this.produtos = []; }
  getQuantidade(): number { return this.produtos.length; }
}
