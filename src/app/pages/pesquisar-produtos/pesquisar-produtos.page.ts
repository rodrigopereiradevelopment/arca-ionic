import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { HistoricoService } from '../../services/historico.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { ComparacaoService } from '../../services/comparacao.service';
import { environment } from '../../../environments/environment';
import { MERCADOS_MAP, CATEGORIAS_MAP, MEDALHAS } from '../../constants/mercados';

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
  Math = Math;
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
    private historicoService: HistoricoService,
    public comparacaoService: ComparacaoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.busca = params['q'];
        this.handleSearch({ detail: { value: params['q'] } });
      }
    });
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
        const m = MERCADOS_MAP[pr.supermercado_id] ?? { nome: 'Mercado', logo: '' };
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
      quantidade: 1  // ✨ NOVO: começa com 1
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
      quantidade: p.quantidade  // ✨ NOVO
    });
  }

  abrirModal(p: Produto) {
    this.modalProduto = p;
    this.historicoService.adicionar({
      tipo: 'pesquisa', descricao: p.nome,
      detalhe: 'Menor preço: R$ ' + p.menorPreco.toFixed(2) + ' no ' + p.mercadoMaisBarato,
      icone: '🔍', rota: '/pesquisar-produtos'
    });
  }

  // ✨ MELHORADO: Adicionar com quantidade
  async adicionarLista(p: Produto) {
    this.carrinhoService.adicionar({ 
      id: p.id, 
      nome: p.nome, 
      img: p.img, 
      menorPreco: p.menorPreco, 
      mercadoMaisBarato: p.mercadoMaisBarato,
      quantidade: p.quantidade  // ✨ Envia a quantidade!
    });
    
    if (p.quantidade > 1) {
      this.mostrarToast(`${p.nome} (${p.quantidade}x) adicionado! ✅`, 'success');
    } else {
      this.mostrarToast(`${p.nome} adicionado à lista! ✅`, 'success');
    }
    
    // Reset quantidade depois de adicionar
    p.quantidade = 1;
  }

  // ✨ NOVO: Aumentar quantidade no modal
  aumentarQuantidade(p: Produto) {
    p.quantidade++;
  }

  // ✨ NOVO: Diminuir quantidade no modal
  diminuirQuantidade(p: Produto) {
    if (p.quantidade > 1) {
      p.quantidade--;
    }
  }

  async criarAlerta(p: Produto) { 
    this.mostrarToast(`Alerta criado para ${p.nome}! 🔔`, 'primary'); 
  }

  naLista(id: number) { 
    return this.carrinhoService.contem(id); 
  }

  private async mostrarToast(message: string, color: string) {
    const t = await this.toastCtrl.create({ 
      message, 
      duration: 2000, 
      color, 
      position: 'top' 
    });
    await t.present();
  }
}