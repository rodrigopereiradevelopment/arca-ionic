import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { HistoricoService } from '../../services/historico.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { environment } from '../../../environments/environment';

interface Preco {
  mercado: string;
  logo: string;
  valor: number;
  posicao: string;
}

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  ean: string;
  img: string;
  menorPreco: number;
  mercadoMaisBarato: string;
  precos: Preco[];
  expandido: boolean;
}

const MERCADOS: Record<number, { nome: string; logo: string }> = {
  1: { nome: 'GoodBom',    logo: 'assets/img/goodbom.png' },
  2: { nome: 'PagueMenos', logo: 'assets/img/paguemenos.png' },
  3: { nome: 'São Vicente', logo: 'assets/img/saovicente.png' },
  4: { nome: 'Atacadão',   logo: 'assets/img/atacadao.png' },
  5: { nome: 'Imperial',   logo: 'assets/img/imperial.png' },
  6: { nome: 'Ponto Novo', logo: 'assets/img/pontonovo.png' },
};

// Mapeamento de categoria_id para nome da categoria
const CATEGORIAS: Record<number, string> = {
  1: 'Bebidas',
  2: 'Mercearia',
  3: 'Bebidas',      // Águas, refrigerantes, etc.
  4: 'Laticínios',
  5: 'Hortifruti',
  6: 'Carnes',
  7: 'Limpeza',
  8: 'Higiene',
  9: 'Outros'       // Biscoitos, etc.
};

const MEDALHAS = ['assets/img/ouro.png', 'assets/img/prata.png', 'assets/img/bronze.png'];

@Component({
  selector: 'app-pesquisar-produtos',
  templateUrl: './pesquisar-produtos.page.html',
  styleUrls: ['./pesquisar-produtos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class PesquisarProdutosPage implements OnInit {

  busca = '';
  categoriaAtiva = 'Todas';
  ordenacao: 'preco' | 'nome' = 'preco';
  modalProduto: Produto | null = null;
  loading = false;

  categorias = ['Todas', 'Bebidas', 'Mercearia', 'Laticínios', 'Hortifruti', 'Carnes', 'Limpeza', 'Higiene'];
  produtos: Produto[] = [];

  constructor(
    private toastCtrl: ToastController,
    public carrinhoService: CarrinhoService,
    private historicoService: HistoricoService
  ) {}

  ngOnInit() {}

  async handleSearch(event: any) {
    const query = (event.detail?.value ?? this.busca).trim();
    this.busca = query;

    if (query.length < 2) {
      this.produtos = [];
      return;
    }

    this.loading = true;
    try {
      const res = await fetch(
        `${environment.apiUrl}/api/produtos/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error('Erro na busca');
      const raw: any[] = await res.json();
      this.produtos = raw.map(p => this.mapearProduto(p));
    } catch (err) {
      console.error(err);
      this.mostrarToast('Erro ao buscar produtos ❌', 'danger');
    } finally {
      this.loading = false;
    }
  }

  private mapearProduto(p: any): Produto {
    const precosOrdenados = (p.precos ?? [])
      .sort((a: any, b: any) => a.preco - b.preco)
      .map((pr: any, i: number) => {
        const m = MERCADOS[pr.supermercado_id] ?? { nome: 'Mercado', logo: '' };
        return {
          mercado: m.nome,
          logo: m.logo,
          valor: pr.preco,
          posicao: MEDALHAS[i] ?? ''
        };
      });

    return {
      id: p.id,
      nome: p.nome,
      categoria: CATEGORIAS[p.categoria_id] ?? 'Outros',  // USA categoria_id
      ean: p.codigo_barras ?? '',                         // USA codigo_barras
      img: p.imagem_url ?? 'assets/img/Produto1.png',
      menorPreco: precosOrdenados[0]?.valor ?? 0,
      mercadoMaisBarato: precosOrdenados[0]?.mercado ?? '-',
      precos: precosOrdenados,
      expandido: false
    };
  }

  get produtosFiltrados() {
    return this.produtos
      .filter(p => {
        const catOk = this.categoriaAtiva === 'Todas' || p.categoria === this.categoriaAtiva;
        return catOk;
      })
      .sort((a, b) => this.ordenacao === 'preco'
        ? a.menorPreco - b.menorPreco
        : a.nome.localeCompare(b.nome));
  }

  toggleExpanir(p: Produto) { p.expandido = !p.expandido; }

  abrirModal(p: Produto) {
    this.modalProduto = p;
    this.historicoService.adicionar({
      tipo: 'pesquisa',
      descricao: p.nome,
      detalhe: 'Menor preço: R$ ' + p.menorPreco.toFixed(2) + ' no ' + p.mercadoMaisBarato,
      icone: '🔍',
      rota: '/pesquisar-produtos'
    });
  }

  async adicionarLista(p: Produto) {
    this.carrinhoService.adicionar({
      id: p.id, nome: p.nome, img: p.img,
      menorPreco: p.menorPreco, mercadoMaisBarato: p.mercadoMaisBarato
    });
    this.mostrarToast(`${p.nome} adicionado à lista! ✅`, 'success');
  }

  async criarAlerta(p: Produto) {
    this.mostrarToast(`Alerta criado para ${p.nome}! 🔔`, 'primary');
  }

  naLista(id: number) { return this.carrinhoService.contem(id); }

  private async mostrarToast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 2000, color, position: 'top' });
    await t.present();
  }
}