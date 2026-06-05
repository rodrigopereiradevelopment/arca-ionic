import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface ItemLista {
  id: number;
  nome: string;
  img: string;
  menorPreco: number;
  mercadoMaisBarato: string;
  quantidade: number;
}

const STORAGE_KEY = 'arca_carrinho';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private auth = inject(AuthService);
  private itens = new BehaviorSubject<ItemLista[]>([]);
  private syncPendente = false;

  itens$ = this.itens.asObservable();
  get lista() { return this.itens.getValue(); }
  get total() { return this.lista.reduce((acc, i) => acc + (i.menorPreco * i.quantidade), 0); }
  get quantidadeTotal() { return this.lista.reduce((acc, i) => acc + i.quantidade, 0); }
  get quantidadeProdutos() { return this.lista.length; }

  constructor() {
    this.carregarDoStorage();
  }

  async carregarDoServidor() {
    if (!this.auth.logado) return;
    try {
      const token = this.auth.usuario?.token;
      const res = await fetch(`${environment.apiUrl}/api/carrinho`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.itens && data.itens.length > 0) {
        const mapeados: ItemLista[] = data.itens.map((i: any) => ({
          id: i.produto_id,
          nome: i.nome,
          img: i.imagem_url || 'assets/img/Produto1.png',
          menorPreco: 0,
          mercadoMaisBarato: '',
          quantidade: i.quantidade,
        }));
        this.itens.next(mapeados);
        this.salvarStorage();
      }
    } catch {
      /* offline — usa localStorage */
    }
  }

  adicionar(item: ItemLista) {
    const atual = this.itens.getValue();
    const existe = atual.find(i => i.id === item.id);
    if (existe) {
      this.itens.next(atual.map(i =>
        i.id === item.id ? { ...i, quantidade: i.quantidade + (item.quantidade || 1) } : i
      ));
    } else {
      this.itens.next([...atual, { ...item, quantidade: item.quantidade || 1 }]);
    }
    this.posMutacao();
  }

  incrementar(id: number) {
    this.itens.next(this.lista.map(i =>
      i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i
    ));
    this.posMutacao();
  }

  decrementar(id: number) {
    this.itens.next(
      this.lista.map(i =>
        i.id === id && i.quantidade > 1 ? { ...i, quantidade: i.quantidade - 1 } : i
      ).filter(i => i.quantidade > 0)
    );
    this.posMutacao();
  }

  definirQuantidade(id: number, quantidade: number) {
    if (quantidade <= 0) { this.remover(id); return; }
    this.itens.next(this.lista.map(i => i.id === id ? { ...i, quantidade } : i));
    this.posMutacao();
  }

  remover(id: number) {
    this.itens.next(this.itens.getValue().filter(i => i.id !== id));
    this.posMutacao();
  }

  contem(id: number) {
    return this.itens.getValue().some(i => i.id === id);
  }

  limpar() {
    this.itens.next([]);
    this.posMutacao();
  }

  private posMutacao() {
    this.salvarStorage();
    this.agendarSync();
  }

  private salvarStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lista));
  }

  private carregarDoStorage() {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) this.itens.next(JSON.parse(salvo));
    } catch { /* ignora */ }
  }

  private async agendarSync() {
    if (this.syncPendente || !this.auth.logado) return;
    this.syncPendente = true;
    const token = this.auth.usuario?.token;
    try {
      const payload = this.lista.map(i => ({
        produto_id: i.id,
        quantidade: i.quantidade,
      }));
      await fetch(`${environment.apiUrl}/api/carrinho`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, itens: payload }),
      });
    } catch {
      /* falha silenciosa — próximo sync tenta de novo */
    } finally {
      this.syncPendente = false;
    }
  }
}