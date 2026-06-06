import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { ComparacaoService } from '../../services/comparacao.service';
import { HistoricoService } from '../../services/historico.service';
import { environment } from '../../../environments/environment';
import { MERCADOS_MAP, MEDALHAS } from '../../constants/mercados';

interface ProdutoDetalhe {
  id: number;
  nome: string;
  quantidade: number;
  precoEncontrado: number;
  naoEncontrado?: boolean;
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

const CACHE_KEY = 'arca_compare_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

@Component({
  selector: 'app-comparar',
  templateUrl: './comparar.page.html',
  styleUrls: ['./comparar.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonSpinner]
})
export class CompararPage {
  mercados: MercadoComPreco[] = [];
  loading = false;
  produtosSelecionados: any[] = [];

  private historicoService = inject(HistoricoService);

  constructor(private comparacaoService: ComparacaoService, private toastCtrl: ToastController) {}

  async ionViewWillEnter() {
    this.produtosSelecionados = this.comparacaoService.getProdutos();
    if (this.produtosSelecionados.length === 0) {
      this.mostrarToast('Nenhum produto selecionado', 'warning');
      return;
    }

    const cache = this.lerCache();
    const payload = this.produtosSelecionados.map(p => ({
      id: p.id, nome: p.nome, quantidade: p.quantidade || 1
    }));
    const hash = this.hashPayload(payload);

    if (cache && cache.hash === hash && Date.now() - cache.timestamp < CACHE_TTL) {
      this.mercados = cache.mercados;
      this.mostrarToast('Resultados da comparação', 'success');
      return;
    }

    await this.calcularCesta(payload, hash);
  }

  private hashPayload(payload: any[]): string {
    return payload.map(p => `${p.id}x${p.quantidade}`).join('|');
  }

  private lerCache(): { hash: string; timestamp: number; mercados: MercadoComPreco[] } | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private salvarCache(hash: string, mercados: MercadoComPreco[]) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ hash, timestamp: Date.now(), mercados }));
    } catch {}
  }

  async calcularCesta(produtosPayload: any[], hash: string) {
    this.loading = true;
    this.mercados = [];

    try {
      const response = await fetch(`${environment.apiUrl}/api/comparar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtos: produtosPayload })
      });

      const data = await response.json();

      if (data.sucesso && data.mercados) {
        this.mercados = data.mercados.map((m: any, i: number) => {
          const mercadoInfo = MERCADOS_MAP[m.id];

          const produtosDetalhe: ProdutoDetalhe[] = m.produtos.map((prod: any) => ({
            id: prod.id || 0,
            nome: prod.nome,
            quantidade: prod.quantidade,
            precoEncontrado: prod.precoUnitario || 0,
            naoEncontrado: prod.naoEncontrado || false
          }));

          return {
            id: m.id,
            nome: m.nome,
            logo: mercadoInfo?.logo || 'assets/img/mercado.png',
            preco: m.total,
            precoFormatado: m.total > 0 ? `R$ ${m.total.toFixed(2)}` : 'Sem dados',
            itens: m.itensEncontrados,
            posicao: i === 0 && m.total > 0 ? MEDALHAS[0]
                   : i === 1 && m.total > 0 ? MEDALHAS[1]
                   : i === 2 && m.total > 0 ? MEDALHAS[2] : '',
            expandido: false,
            produtos: produtosDetalhe
          };
        });

        this.salvarCache(hash, this.mercados);

        const melhor = this.mercados.find(m => m.preco > 0);
        if (melhor) {
          this.historicoService.adicionar({
            tipo: 'comparacao',
            descricao: `Comparação de ${this.produtosSelecionados.length} produto(s)`,
            detalhe: `Melhor: ${melhor.nome} ${melhor.precoFormatado}`,
            icone: '💰',
            rota: '/comparar',
          });
        }
      } else {
        this.mostrarToast('Erro ao comparar preços', 'danger');
      }
    } catch {
      this.mostrarToast('Erro de conexão com o servidor', 'danger');
    } finally {
      this.loading = false;
    }
  }

  limparSelecao() {
    this.comparacaoService.limpar();
    this.mercados = [];
    this.produtosSelecionados = [];
    localStorage.removeItem(CACHE_KEY);
  }

  toggleExpandir(mercado: MercadoComPreco) {
    mercado.expandido = !mercado.expandido;
  }

  private async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }
}
