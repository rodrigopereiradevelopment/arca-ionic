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
import { DenunciaService } from '../../services/denuncia.service';
import { AudioService } from '../../services/audio.service';
import { AuthService } from '../../services/auth.service';
import { InfoNutricionalService, InfoNutricional, NUTRI_SCORE_CORES } from '../../services/info-nutricional.service';
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
  private authService = inject(AuthService);
  private categoriaService = inject(CategoriaService);
  favoritoService = inject(FavoritoService);
  denunciaSvc = inject(DenunciaService);
  private audio = inject(AudioService);
  private infoNutricionalSvc = inject(InfoNutricionalService);
  readonly NUTRI_SCORE_CORES = NUTRI_SCORE_CORES;
  infoNutricional: InfoNutricional | null = null;
  carregandoInfo = false;

  Math = Math;
  busca = '';
  categoriaAtiva = 'Todas';
  ordenacao: 'preco' | 'nome' = 'preco';
  modalProduto: Produto | null = null;
  modalDenuncia = false;
  denunciaMotivo = '';
  denunciaDescricao = '';
  loading = false;
  pagina = 1;
  carregandoMais = false;
  temMais = false;
  modoBusca = false;
  categorias: string[] = ['Todas'];
  private categoriaMap: Record<string, number> = {};
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

  ionViewWillEnter() {
    if (this.authService.logado && !this.favoritoService.carregado) {
      this.favoritoService.listar();
    }
    if (this.busca.length >= 2) {
      this.handleSearch({ detail: { value: this.busca } });
    }
  }

  private async carregarCategorias() {
    const cats = await this.categoriaService.listar();
    if (cats.length > 0) {
      this.categorias = ['Todas', ...cats.map(c => c.nome)];
      for (const c of cats) {
        this.categoriaMap[c.nome] = c.id;
      }
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
    this.modoBusca = true;
    this.pagina = 1;
    this.temMais = false;
    this.loading = true;
    try {
      const res = await fetch(`${environment.apiUrl}/api/produtos/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Erro na busca');
      const result: any = await res.json();
      const raw: any[] = result.data ?? [];
      this.produtos = raw.map(p => this.mapearProduto(p));
      this.audio.play('scan');
    } catch (err) {
      console.error(err);
      this.audio.play('error');
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

  async selecionarCategoria(cat: string) {
    this.categoriaAtiva = cat;
    if (this.busca.length >= 2) return;
    if (cat === 'Todas') { this.produtos = []; return; }
    this.modoBusca = false;
    this.pagina = 1;
    await this.carregarPorCategoria();
  }

  async carregarPorCategoria(append = false) {
    if (!append) { this.loading = true; this.produtos = []; }
    else { this.carregandoMais = true; }
    try {
      const catId = this.categoriaMap[this.categoriaAtiva];
      if (!catId) return;
      const url = `${environment.apiUrl}/api/produtos/search?categoria_id=${catId}&page=${this.pagina}`;
      const res = await fetch(url);
      const result: any = await res.json();
      const raw: any[] = result.data ?? [];
      this.temMais = result.temMais ?? false;
      const mapped = raw.map(p => this.mapearProduto(p));
      if (append) this.produtos.push(...mapped);
      else this.produtos = mapped;
    } catch (err) {
      console.error(err);
      this.mostrarToast('Erro ao carregar produtos', 'danger');
    } finally {
      this.loading = false;
      this.carregandoMais = false;
    }
  }

  carregarMais() {
    this.pagina++;
    this.carregarPorCategoria(true);
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

  async toggleFavorito(p: Produto) {
    const ativo = this.favoritoService.isFavorito(p.id);
    const ok = await this.favoritoService.toggle(p.id);
    if (!ok && !this.authService.logado) {
      this.mostrarToast('Faça login para favoritar', 'warning');
    }
  }

  abrirModal(p: Produto) {
    this.modalProduto = p;
    this.infoNutricional = null;
    if (p.ean) this.carregarInfoNutricional(p.ean);
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
    
    this.audio.play('coin');
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

  abrirDenuncia(p: Produto) {
    this.modalProduto = p;
    this.modalDenuncia = true;
    this.denunciaMotivo = '';
    this.denunciaDescricao = '';
  }

  async enviarDenuncia() {
    if (!this.denunciaMotivo || !this.modalProduto) return;
    const p = this.modalProduto;
    const erro = await this.denunciaSvc.criar({
      motivo: this.denunciaMotivo,
      descricao: this.denunciaDescricao,
      produto_id: p.id,
      supermercado_id: p.precos[0] ? this.buscarMercadoId(p.precos[0].mercado) : undefined,
    });
    if (erro) {
      await this.mostrarToast(erro, 'danger');
    } else {
      this.audio.play('success');
      this.modalDenuncia = false;
      await this.mostrarToast('Denuncia enviada!', 'success');
    }
  }

  private buscarMercadoId(nome: string): number | undefined {
    for (const [id, m] of Object.entries(this.mapaMercados)) {
      if (m.nome === nome) return Number(id);
    }
    return undefined;
  }

  naLista(id: number) { 
    return this.carrinhoService.contem(id); 
  }

  temNutricao(info: InfoNutricional): boolean {
    return info.nutricao.energia !== null || info.nutricao.gorduras !== null;
  }

  private async carregarInfoNutricional(barcode: string) {
    this.carregandoInfo = true;
    this.infoNutricional = await this.infoNutricionalSvc.buscar(barcode);
    this.carregandoInfo = false;
  }

  private async mostrarToast(message: string, color: string) {
    const t = await this.toastCtrl.create({ 
      message, duration: 2000, color, position: 'top' 
    });
    await t.present();
  }
}
