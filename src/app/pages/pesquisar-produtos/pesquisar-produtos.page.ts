import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { HistoricoService } from '../../services/historico.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { ComparacaoService } from '../../services/comparacao.service';
import { CategoriaService } from '../../services/categoria.service';
import { FavoritoService } from '../../services/favorito.service';
import { environment } from '../../../environments/environment';
import { CATEGORIAS_MAP, MEDALHAS } from '../../constants/mercados';

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
  quantidade: number;
}

@Component({
  selector: 'app-pesquisar-produtos',
  templateUrl: './pesquisar-produtos.page.html',
  styleUrls: ['./pesquisar-produtos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class PesquisarProdutosPage implements OnInit {
  private toastCtrl = inject(ToastController);
  carrinhoService = inject(CarrinhoService);
  private historicoService = inject(HistoricoService);
  comparacaoService = inject(ComparacaoService);
  private route = inject(ActivatedRoute);
  private categoriaService = inject(CategoriaService);
  favoritoService = inject(FavoritoService);

  Math = Math;
  busca = '';
  categoriaAtiva = 'Todas';
  ordenacao: 'preco' | 'nome' = 'preco';
  modalProduto: Produto | null = null;
  loading = false;
  categorias: string[] = ['Todas'];
  produtos: Produto[] = [];

  private mapaMercados: Record<number, { nome: string; logo: string }> = {};

  async ngOnInit() {
    await Promise.all([
      this.carregarCategorias(),
      this.carregarMercados(),
    ]);
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.busca = params['q'];
        this.handleSearch({ detail: { value: params['q'] } });
      }
    });
  }

  private async carregarCategorias() {
    const cats = await this.categoriaService.listar();
    if (cats.length > 0) {
      this.categorias = ['Todas', ...cats.map(c => c.nome)];
    }
  }

  private async carregarMercados() {
    try {
      const res = await fetch(`${environment.apiUrl}/api/mercados`);
      if (res.ok) {
        const data = await res.json();
        for (const m of data) {
          this.mapaMercados[m.id] = {
            nome: m.nome,
            logo: m.logo_url || `assets/img/${m.nome?.toLowerCase().replace(/\s/g, '')}.png`,
          };
        }
      }
    } catch {}
  }

  async handleSearch(event: any) {
    const query = (event.detail?.value ?? this.busca).trim();
    this.busca = query;
    if (query.length < 2) { this.produtos = []; return; }
    this.loading = true;
    try {
      const res = await fetch(`${environment.apiUrl}/api/produtos/search?q=${encodeURIComponent(query)}`);
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
        const m = this.mapaMercados[pr.supermercado_id] ?? { nome: 'Mercado', logo: '' };
        return { mercado: m.nome, logo: m.logo, valor: pr.preco, posicao: MEDALHAS[i] ?? '' };
      });
    return {
      id: p.id, 
      nome: p.nome,
      categoria: CATEGORIAS_MAP[p.categoria_id] ?? 'Outros',
      ean: p.codigo_barras ?? '',
      img: p.imagem_url ?? 'assets/img/Produto1.png',
      menorPreco: precosOrdenados[0]?.valor ?? 0,
      mercadoMaisBarato: precosOrdenados[0]?.mercado ?? '-',
      precos: precosOrdenados, 
      expandido: false,
      quantidade: 1
    };
  }

  get produtosFiltrados() {
    return this.produtos
      .filter(p => this.categoriaAtiva === 'Todas' || p.categoria === this.categoriaAtiva)
      .sort((a, b) => this.ordenacao === 'preco' ? a.menorPreco - b.menorPreco : a.nome.localeCompare(b.nome));
  }

  toggleExpanir(p: Produto) { p.expandido = !p.expandido; }
  
  toggleComparar(p: Produto) {
    if (this.comparacaoService.contem(p.id)) this.comparacaoService.remover(p.id);
    else this.comparacaoService.adicionar({ 
      id: p.id, 
      nome: p.nome, 
      img: p.img, 
      menorPreco: p.menorPreco, 
      mercadoMaisBarato: p.mercadoMaisBarato,
      quantidade: p.quantidade
    });
  }

  toggleFavorito(p: Produto) {
    this.favoritoService.toggle(p.id);
  }

  abrirModal(p: Produto) {
    this.modalProduto = p;
    this.historicoService.adicionar({
      tipo: 'pesquisa', descricao: p.nome,
      detalhe: 'Menor preço: R$ ' + p.menorPreco.toFixed(2) + ' no ' + p.mercadoMaisBarato,
      icone: '🔍', rota: '/pesquisar-produtos'
    });
  }

  async adicionarLista(p: Produto) {
    this.carrinhoService.adicionar({ 
      id: p.id, 
      nome: p.nome, 
      img: p.img, 
      menorPreco: p.menorPreco, 
      mercadoMaisBarato: p.mercadoMaisBarato,
      quantidade: p.quantidade
    });
    
    if (p.quantidade > 1) {
      this.mostrarToast(`${p.nome} (${p.quantidade}x) adicionado! ✅`, 'success');
    } else {
      this.mostrarToast(`${p.nome} adicionado à lista! ✅`, 'success');
    }
    
    p.quantidade = 1;
  }

  aumentarQuantidade(p: Produto) { p.quantidade++; }

  diminuirQuantidade(p: Produto) {
    if (p.quantidade > 1) p.quantidade--;
  }

  async criarAlerta(p: Produto) { 
    this.mostrarToast(`Alerta criado para ${p.nome}! 🔔`, 'primary'); 
  }

  naLista(id: number) { 
    return this.carrinhoService.contem(id); 
  }

  private async mostrarToast(message: string, color: string) {
    const t = await this.toastCtrl.create({ 
      message, duration: 2000, color, position: 'top' 
    });
    await t.present();
  }
}
