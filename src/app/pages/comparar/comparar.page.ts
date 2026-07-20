import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSpinner, IonSegment, IonSegmentButton, IonLabel, IonButton, IonIcon, IonProgressBar, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { list } from 'ionicons/icons';
import { ComparacaoService } from '../../services/comparacao.service';
import { HistoricoService } from '../../services/historico.service';
import { ListaService, ListaComparacao } from '../../services/lista.service';
import { environment } from '../../../environments/environment';
import { MERCADOS_MAP } from '../../constants/mercados';

interface ProdutoDetalhe {
  id: number;
  nome: string;
  nomeEncontrado?: string;
  quantidade: number;
  precoEncontrado: number;
  naoEncontrado?: boolean;
  similarInfo?: {
    nomeOriginal: string;
    motivo: string;
    score: number;
  };
}

interface MercadoComPreco {
  id: number;
  nome: string;
  logo: string;
  posicao: string;
  preco: number;
  precoFormatado: string;
  itens: number;
  expandido: boolean;
  produtos: ProdutoDetalhe[];
}

const CACHE_TTL = 60 * 1000;
const CACHE_PREFIX = 'arca_chunk_';
const CHUNK_SIZE = 20;
const CONCORRENCIA = 3;

@Component({
  selector: 'app-comparar',
  templateUrl: './comparar.page.html',
  styleUrls: ['./comparar.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IonContent, IonSpinner, IonSegment, IonSegmentButton, IonLabel, IonButton, IonIcon, IonProgressBar]
})
export class CompararPage {
  private comparacaoService = inject(ComparacaoService);
  private listaService = inject(ListaService);
  private toastCtrl = inject(ToastController);

  mercados: MercadoComPreco[] = [];
  loading = false;
  produtosSelecionados: any[] = [];
  listas: ListaComparacao[] = [];
  listaSelecionada = 'atual';

  progressoCarregados = 0;
  totalProdutos = 0;

  private historicoService = inject(HistoricoService);

  constructor() { addIcons({ list }); }

  async ionViewWillEnter() {
    this.listas = await this.listaService.listar();
    await this.carregarProdutos();
  }

  async trocarLista(event: any) {
    this.listaSelecionada = event.detail.value;
    await this.carregarProdutos();
  }

  private async carregarProdutos() {
    if (this.listaSelecionada === 'atual') {
      this.produtosSelecionados = this.comparacaoService.getProdutos();
    } else {
      const lista = this.listas.find(l => String(l.id) === this.listaSelecionada);
      if (lista) {
        this.produtosSelecionados = lista.itens.map(i => ({
          id: i.id, nome: i.nome, quantidade: i.quantidade || 1
        }));
      }
    }

    if (this.produtosSelecionados.length === 0) {
      this.mostrarToast('Nenhum produto selecionado', 'warning');
      return;
    }

    const payload = this.produtosSelecionados.map(p => ({
      id: p.id, nome: p.nome, quantidade: p.quantidade || 1
    }));
    const hash = this.hashPayload(payload);

    await this.calcularCesta(payload);
  }

  private hashPayload(payload: any[]): string {
    return payload.map(p => `${p.id}x${p.quantidade}`).join('|');
  }

  private lerChunkCache(hash: string): any[] | null {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + hash);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (Date.now() - data.timestamp < CACHE_TTL) return data.mercados;
      localStorage.removeItem(CACHE_PREFIX + hash);
      return null;
    } catch { return null; }
  }

  private salvarChunkCache(hash: string, mercados: any[]) {
    try {
      localStorage.setItem(CACHE_PREFIX + hash, JSON.stringify({
        mercados, timestamp: Date.now()
      }));
    } catch {}
  }

  private limparChunkCaches() {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      }
    } catch {}
  }

  async calcularCesta(produtosPayload: any[]) {
    this.loading = true;
    this.mercados = [];
    this.totalProdutos = produtosPayload.length;
    this.progressoCarregados = 0;

    const chunks: any[][] = [];
    for (let i = 0; i < produtosPayload.length; i += CHUNK_SIZE) {
      chunks.push(produtosPayload.slice(i, i + CHUNK_SIZE));
    }

    for (let i = 0; i < chunks.length; i += CONCORRENCIA) {
      const batch = chunks.slice(i, i + CONCORRENCIA);

      const results = await Promise.all(
        batch.map(async chunk => {
          const chunkHash = this.hashPayload(chunk);
          const cached = this.lerChunkCache(chunkHash);
          if (cached) return { sucesso: true, mercados: cached } as any;

          try {
            const r = await fetch(`${environment.apiUrl}/api/comparar`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ produtos: chunk })
            });
            const data = await r.json() as any;
            if (data?.sucesso && data?.mercados) {
              this.salvarChunkCache(chunkHash, data.mercados);
            }
            return data;
          } catch { return null; }
        })
      );

      for (let j = 0; j < results.length; j++) {
        const data = results[j];
        if (data?.sucesso && data?.mercados) {
          this.aplicarChunk(data.mercados, batch[j].length);
        }
      }
    }

    this.ordenarMercados();

    if (this.mercados.length > 0) {
      const melhor = this.mercados.find(m => m.preco > 0);
      if (melhor) {
        this.historicoService.adicionar({
          tipo: 'comparacao',
          descricao: `Comparação de ${this.totalProdutos} produto(s)`,
          detalhe: `Melhor: ${melhor.nome} ${melhor.precoFormatado}`,
          icone: '💰',
          rota: '/comparar',
        });
      }
    } else {
      this.mostrarToast('Erro ao comparar preços', 'danger');
    }

    this.loading = false;
  }

  private aplicarChunk(mercadosChunk: any[], qtdProdutos: number) {
    if (this.mercados.length === 0) {
      this.mercados = mercadosChunk.map((m: any, i: number) => this.mapearMercado(m, i));
    } else {
      for (const mc of mercadosChunk) {
        const alvo = this.mercados.find(m => m.id === mc.id);
        if (alvo) {
          alvo.preco += mc.total || 0;
          alvo.itens += mc.itensEncontrados || 0;
          alvo.precoFormatado = alvo.preco > 0 ? `R$ ${alvo.preco.toFixed(2)}` : 'Sem dados';
          const prods = (mc.produtos || []).map((p: any) => this.mapearProduto(p));
          alvo.produtos.push(...prods);
        }
      }
    }
    this.progressoCarregados += qtdProdutos;
    this.ordenarMercados();
  }

  private mapearMercado(m: any, idx: number): MercadoComPreco {
    const mercadoInfo = MERCADOS_MAP[m.id];
    return {
      id: m.id,
      nome: m.nome,
      logo: mercadoInfo?.logo || 'assets/img/mercado.png',
      preco: m.total || 0,
      precoFormatado: m.total > 0 ? `R$ ${Number(m.total).toFixed(2)}` : 'Sem dados',
      itens: m.itensEncontrados || 0,
      posicao: '',
      expandido: false,
      produtos: (m.produtos || []).map((p: any) => this.mapearProduto(p)),
    };
  }

  private mapearProduto(prod: any): ProdutoDetalhe {
    return {
      id: prod.id || 0,
      nome: prod.nome,
      nomeEncontrado: prod.nomeEncontrado || prod.nome,
      quantidade: prod.quantidade,
      precoEncontrado: prod.precoUnitario || 0,
      naoEncontrado: prod.naoEncontrado || false,
      similarInfo: prod.similarInfo || undefined,
    };
  }

  private ordenarMercados() {
    this.mercados.sort((a, b) => {
      if (b.itens !== a.itens) return b.itens - a.itens;
      return a.preco - b.preco;
    });

    this.mercados.forEach((m, i) => {
      m.posicao = `${i + 1}°`;
    });
  }

  toStr(v: any): string { return String(v); }

  getPorcentagem(itens: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((itens / total) * 100);
  }

  limparSelecao() {
    this.comparacaoService.limpar();
    this.mercados = [];
    this.produtosSelecionados = [];
    this.progressoCarregados = 0;
    this.totalProdutos = 0;
    this.limparChunkCaches();
  }

  toggleExpandir(mercado: MercadoComPreco) {
    mercado.expandido = !mercado.expandido;
  }

  private async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }
}
