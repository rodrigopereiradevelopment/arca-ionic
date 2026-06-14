import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { ProdutoService, Produto, Preco } from '../../services/produto.service';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gerenciar-produtos',
  templateUrl: './gerenciar-produtos.page.html',
  styleUrls: ['./gerenciar-produtos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class GerenciarProdutosPage {
  private toastCtrl = inject(ToastController);
  private produtoSvc = inject(ProdutoService);
  private categoriaSvc = inject(CategoriaService);
  private auth = inject(AuthService);


  abaAtiva: 'produtos' | 'categorias' | 'precos' = 'produtos';
  modalAberto = false;
  modoEdicao = false;
  filtroNome = '';
  filtroCategoria = 'todas';
  novaCategoria = '';
  carregando = true;
  erro = '';

  produtos: Produto[] = [];
  categorias: Categoria[] = [];

  pagina = 1;
  limite = 15;
  temMais = false;
  carregandoMais = false;
  private timerBusca: any;

  precosProduto: Preco[] = [];
  carregandoPrecos = false;
  precosRecentes: Preco[] = [];
  carregandoRecentes = false;

  produtoSelecionado: any = {};
  imagemPreview: string | null = null;
  imagemFile: File | undefined;

  async ionViewWillEnter() {
    const [categorias] = await Promise.all([
      this.categoriaSvc.listar().catch(() => [] as Categoria[]),
      this.carregarProdutos(),
    ]);
    this.categorias = categorias;
  }

  private async carregarProdutos(append = false) {
    if (!append) {
      this.carregando = true;
      this.produtos = [];
    } else {
      this.carregandoMais = true;
    }
    this.erro = '';

    try {
      const catId = this.filtroCategoria !== 'todas'
        ? this.categorias.find(c => c.nome === this.filtroCategoria)?.id
        : undefined;

      const result = await this.produtoSvc.listar({
        busca: this.filtroNome || undefined,
        categoria_id: catId,
        ativo: 'todos',
        page: this.pagina,
        limit: this.limite,
      });

      if (append) {
        this.produtos.push(...result.data);
      } else {
        this.produtos = result.data;
      }
      this.temMais = result.temMais ?? (this.produtos.length < result.total);
    } catch {
      this.erro = 'Erro ao carregar dados.';
    } finally {
      this.carregando = false;
      this.carregandoMais = false;
    }
  }

  onBuscaChange(valor: string) {
    this.filtroNome = valor;
    clearTimeout(this.timerBusca);
    this.timerBusca = setTimeout(() => {
      this.pagina = 1;
      this.carregarProdutos();
    }, 500);
  }

  onCategoriaChange() {
    this.pagina = 1;
    this.carregarProdutos();
  }

  async selecionarAba(aba: 'produtos' | 'categorias' | 'precos') {
    this.abaAtiva = aba;
    if (aba === 'precos' && this.precosRecentes.length === 0) {
      this.carregandoRecentes = true;
      this.precosRecentes = await this.produtoSvc.listarPrecos();
      this.carregandoRecentes = false;
    }
  }

  async mostrarMais() {
    this.pagina++;
    await this.carregarProdutos(true);
  }

  async abrirNovo() {
    this.modoEdicao = false;
    this.produtoSelecionado = {};
    this.imagemPreview = null;
    this.imagemFile = undefined;
    this.precosProduto = [];
    this.modalAberto = true;
  }

  async editar(p: Produto) {
    this.modoEdicao = true;
    this.produtoSelecionado = { ...p };
    if (!p.categoria && (p as any).categoria_id) {
      const cat = this.categorias.find(c => c.id === (p as any).categoria_id);
      if (cat) this.produtoSelecionado.categoria = cat.nome;
    }
    this.imagemPreview = p.imagem_url || null;
    this.imagemFile = undefined;
    this.precosProduto = [];
    this.carregandoPrecos = true;
    this.modalAberto = true;

    this.precosProduto = await this.produtoSvc.listarPrecos(p.id);
    this.carregandoPrecos = false;
  }

  async excluir(p: Produto) {
    const token = this.auth.usuario?.token;
    if (!token) return this.toast('Faça login primeiro!', 'warning');
    const ok = await this.produtoSvc.excluir(p.id, token);
    if (ok) {
      this.produtos = this.produtos.filter(x => x.id !== p.id);
      if (this.produtos.length === 0) this.temMais = false;
      await this.toast('Produto excluído!', 'success');
    } else {
      await this.toast('Erro ao excluir produto.', 'danger');
    }
  }

  async salvar() {
    if (!this.produtoSelecionado.nome || !this.produtoSelecionado.categoria) {
      await this.toast('Preencha os campos obrigatórios!', 'warning');
      return;
    }

    const token = this.auth.usuario?.token;
    if (!token) {
      await this.toast('Faça login primeiro!', 'warning');
      return;
    }

    const categoriaSel = this.categorias.find(
      c => c.nome === this.produtoSelecionado.categoria
    );

    const dados = {
      nome: this.produtoSelecionado.nome,
      descricao: this.produtoSelecionado.descricao || '',
      marca: this.produtoSelecionado.marca || '',
      ean: this.produtoSelecionado.ean || '',
      categoria_id: categoriaSel?.id || null,
      tipo: this.produtoSelecionado.tipo || 'industrializado',
      peso_volume: this.produtoSelecionado.peso_volume || '',
    };

    if (this.modoEdicao) {
      const ok = await this.produtoSvc.atualizar(
        this.produtoSelecionado.id,
        dados,
        token,
        this.imagemFile
      );
      if (ok) {
        await this.carregarProdutos();
        await this.toast('Produto atualizado!', 'success');
      } else {
        await this.toast('Erro ao atualizar produto.', 'danger');
      }
    } else {
      const ok = await this.produtoSvc.criar(dados, token, this.imagemFile);
      if (ok) {
        await this.carregarProdutos();
        await this.toast('Produto cadastrado!', 'success');
      } else {
        await this.toast('Erro ao cadastrar produto.', 'danger');
      }
    }

    this.modalAberto = false;
  }

  async adicionarCategoria() {
    const nome = this.novaCategoria.trim();
    if (!nome) {
      await this.toast('Digite o nome da categoria!', 'warning');
      return;
    }
    const token = this.auth.usuario?.token;
    if (!token) {
      await this.toast('Faça login primeiro!', 'warning');
      return;
    }
    const ok = await this.categoriaSvc.criar(nome, token);
    if (ok) {
      this.categorias.push(ok);
      this.novaCategoria = '';
      await this.toast('Categoria adicionada!', 'success');
    } else {
      await this.toast('Erro ao adicionar categoria.', 'danger');
    }
  }

  async excluirCategoria(c: Categoria) {
    const token = this.auth.usuario?.token;
    if (!token) return this.toast('Faça login primeiro!', 'warning');
    const ok = await this.categoriaSvc.excluir(c.id, token);
    if (ok) {
      this.categorias = this.categorias.filter(x => x.id !== c.id);
      await this.toast('Categoria excluída!', 'success');
    } else {
      await this.toast('Erro ao excluir categoria.', 'danger');
    }
  }

  onImagemSelecionada(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.imagemFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagemPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  formatarData(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      color,
      position: 'top',
    });
    await t.present();
  }
}
