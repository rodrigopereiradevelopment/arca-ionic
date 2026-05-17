import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ComparacaoService {
  private readonly KEY = 'arca_comparacao';
  private produtos: any[] = this.carregar();

  private carregar(): any[] {
    try {
      const salvo = localStorage.getItem(this.KEY);
      return salvo ? JSON.parse(salvo) : [];
    } catch { return []; }
  }

  private salvar() {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(this.produtos));
    } catch {}
  }

  adicionar(produto: any) {
    if (!this.produtos.find(p => p.id === produto.id)) {
      this.produtos.push(produto);
      this.salvar();
    }
  }

  remover(id: number) {
    this.produtos = this.produtos.filter(p => p.id !== id);
    this.salvar();
  }

  getProdutos(): any[] { return this.produtos; }

  contem(id: number): boolean { return !!this.produtos.find(p => p.id === id); }

  limpar() {
    this.produtos = [];
    this.salvar();
  }

  getQuantidade(): number { return this.produtos.length; }
}