import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  ean: string;
  precosAtivos: number;
}

interface Categoria {
  id: number;
  nome: string;
}

interface Preco {
  produto: string;
  mercado: string;
  valor: number;
  data: string;
}

@Component({
  selector: 'app-gerenciar-produtos',
  templateUrl: './gerenciar-produtos.page.html',
  styleUrls: ['./gerenciar-produtos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class GerenciarProdutosPage implements OnInit {

  abaAtiva: 'produtos' | 'categorias' | 'precos' = 'produtos';
  modalAberto = false;
  modoEdicao = false;
  filtroNome = '';
  filtroCategoria = 'todas';
  novaCategoria = '';
  imagemPreview: string | null = null;

  produtos: Produto[] = [
    { id: 1, nome: 'Café Tradicional 3 Corações', categoria: 'Bebidas', ean: '7896005800027', precosAtivos: 3 },
    { id: 2, nome: 'Açúcar Refinado União', categoria: 'Mercearia', ean: '7891910000197', precosAtivos: 2 },
    { id: 3, nome: 'Arroz Branco Prato Fino', categoria: 'Mercearia', ean: '7896006702018', precosAtivos: 3 }
  ];

  categorias: Categoria[] = [
    { id: 1, nome: 'Bebidas' },
    { id: 2, nome: 'Mercearia' },
    { id: 3, nome: 'Laticínios' },
    { id: 4, nome: 'Hortifruti' },
    { id: 5, nome: 'Carnes' },
    { id: 6, nome: 'Limpeza' },
    { id: 7, nome: 'Higiene' }
  ];

  precos: Preco[] = [
    { produto: 'Café Tradicional 3 Corações', mercado: 'Big Bom', valor: 18.90, data: '13/03/2026' },
    { produto: 'Açúcar Refinado União', mercado: 'SMC', valor: 4.99, data: '13/03/2026' },
    { produto: 'Arroz Branco Prato Fino', mercado: 'SPN', valor: 22.50, data: '12/03/2026' }
  ];

  produtoSelecionado: any = this.novoProduto();

  get produtosFiltrados() {
    return this.produtos.filter(p => {
      const nomeOk = p.nome.toLowerCase().includes(this.filtroNome.toLowerCase()) ||
                     p.ean.includes(this.filtroNome);
      const catOk = this.filtroCategoria === 'todas' || p.categoria === this.filtroCategoria;
      return nomeOk && catOk;
    });
  }

  constructor(private toastCtrl: ToastController) {}
  ngOnInit() {}

  novoProduto() {
    return { id: 0, nome: '', categoria: '', ean: '', precosAtivos: 0 };
  }

  abrirNovo() {
    this.modoEdicao = false;
    this.produtoSelecionado = this.novoProduto();
    this.imagemPreview = null;
    this.modalAberto = true;
  }

  editar(p: Produto) {
    this.modoEdicao = true;
    this.produtoSelecionado = { ...p };
    this.imagemPreview = null;
    this.modalAberto = true;
  }

  async excluir(p: Produto) {
    this.produtos = this.produtos.filter(x => x.id !== p.id);
    await this.toast('Produto excluído!', 'danger');
  }

  async salvar() {
    if (!this.produtoSelecionado.nome || !this.produtoSelecionado.categoria) {
      await this.toast('Preencha os campos obrigatórios!', 'warning');
      return;
    }
    if (this.modoEdicao) {
      const idx = this.produtos.findIndex(p => p.id === this.produtoSelecionado.id);
      if (idx >= 0) this.produtos[idx] = { ...this.produtoSelecionado };
      await this.toast('Produto atualizado!', 'success');
    } else {
      this.produtoSelecionado.id = Date.now();
      this.produtos.push({ ...this.produtoSelecionado });
      await this.toast('Produto cadastrado!', 'success');
    }
    this.modalAberto = false;
  }

  async adicionarCategoria() {
    if (!this.novaCategoria.trim()) {
      await this.toast('Digite o nome da categoria!', 'warning');
      return;
    }
    this.categorias.push({ id: Date.now(), nome: this.novaCategoria.trim() });
    this.novaCategoria = '';
    await this.toast('Categoria adicionada!', 'success');
  }

  async excluirCategoria(c: Categoria) {
    this.categorias = this.categorias.filter(x => x.id !== c.id);
    await this.toast('Categoria excluída!', 'danger');
  }

  onImagemSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagemPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }
}
