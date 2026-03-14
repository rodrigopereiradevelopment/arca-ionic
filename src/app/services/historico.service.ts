import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemHistorico {
  id: number;
  tipo: 'pesquisa' | 'comparacao' | 'rota';
  descricao: string;
  detalhe: string;
  data: Date;
  icone: string;
  rota?: string;
}

@Injectable({ providedIn: 'root' })
export class HistoricoService {

  private itens = new BehaviorSubject<ItemHistorico[]>([
    {
      id: 1, tipo: 'pesquisa',
      descricao: 'Café Tradicional 3 Corações',
      detalhe: 'Menor preço: R$ 18,90 no Big Bom',
      data: new Date(), icone: '🔍',
      rota: '/pesquisar-produtos'
    },
    {
      id: 2, tipo: 'comparacao',
      descricao: 'Comparação de lista',
      detalhe: 'Big Bom R$ 102,24 · SMC R$ 107,68 · SPN R$ 112,80',
      data: new Date(Date.now() - 86400000), icone: '💰',
      rota: '/comparar'
    },
    {
      id: 3, tipo: 'rota',
      descricao: 'Rota para Big Bom',
      detalhe: 'Mogi Mirim — 0,8 km',
      data: new Date(Date.now() - 172800000), icone: '🗺️',
      rota: '/mapa-rotas'
    }
  ]);

  itens$ = this.itens.asObservable();

  get lista() { return this.itens.getValue(); }

  adicionar(item: Omit<ItemHistorico, 'id' | 'data'>) {
    const atual = this.itens.getValue();
    this.itens.next([
      { ...item, id: Date.now(), data: new Date() },
      ...atual
    ]);
  }

  remover(id: number) {
    this.itens.next(this.itens.getValue().filter(i => i.id !== id));
  }

  limpar() {
    this.itens.next([]);
  }
}
