import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { HistoricoService } from '../../services/historico.service';
import { CarrinhoService } from '../../services/carrinho.service';

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

  categorias = ['Todas', 'Bebidas', 'Mercearia', 'Laticínios', 'Hortifruti', 'Carnes', 'Limpeza', 'Higiene'];

  produtos: Produto[] = [
    {
      id: 1, nome: 'Café Tradicional 3 Corações 500g',
      categoria: 'Bebidas', ean: '7896005800027',
      img: 'assets/img/Produto1.png',
      menorPreco: 18.90, mercadoMaisBarato: 'Big Bom',
      expandido: false,
      precos: [
        { mercado: 'Big Bom', logo: 'assets/img/BigBom-Icon.png', valor: 18.90, posicao: 'assets/img/ouro.png' },
        { mercado: 'SMC', logo: 'assets/img/SMC.png', valor: 20.50, posicao: 'assets/img/prata.png' },
        { mercado: 'SPN', logo: 'assets/img/spn.png', valor: 21.90, posicao: 'assets/img/bronze.png' }
      ]
    },
    {
      id: 2, nome: 'Açúcar Refinado União 1kg',
      categoria: 'Mercearia', ean: '7891910000197',
      img: 'assets/img/Produto2.png',
      menorPreco: 4.99, mercadoMaisBarato: 'SMC',
      expandido: false,
      precos: [
        { mercado: 'SMC', logo: 'assets/img/SMC.png', valor: 4.99, posicao: 'assets/img/ouro.png' },
        { mercado: 'Big Bom', logo: 'assets/img/BigBom-Icon.png', valor: 5.49, posicao: 'assets/img/prata.png' },
        { mercado: 'SPN', logo: 'assets/img/spn.png', valor: 5.89, posicao: 'assets/img/bronze.png' }
      ]
    },
    {
      id: 3, nome: 'Arroz Branco Prato Fino 5kg',
      categoria: 'Mercearia', ean: '7896006702018',
      img: 'assets/img/Produto3.png',
      menorPreco: 22.50, mercadoMaisBarato: 'Big Bom',
      expandido: false,
      precos: [
        { mercado: 'Big Bom', logo: 'assets/img/BigBom-Icon.png', valor: 22.50, posicao: 'assets/img/ouro.png' },
        { mercado: 'SPN', logo: 'assets/img/spn.png', valor: 23.90, posicao: 'assets/img/prata.png' },
        { mercado: 'SMC', logo: 'assets/img/SMC.png', valor: 24.50, posicao: 'assets/img/bronze.png' }
      ]
    },
    {
      id: 4, nome: 'Leite Integral Itambé 1L',
      categoria: 'Laticínios', ean: '7896051113395',
      img: 'assets/img/Produto1.png',
      menorPreco: 4.29, mercadoMaisBarato: 'SPN',
      expandido: false,
      precos: [
        { mercado: 'SPN', logo: 'assets/img/spn.png', valor: 4.29, posicao: 'assets/img/ouro.png' },
        { mercado: 'SMC', logo: 'assets/img/SMC.png', valor: 4.59, posicao: 'assets/img/prata.png' },
        { mercado: 'Big Bom', logo: 'assets/img/BigBom-Icon.png', valor: 4.79, posicao: 'assets/img/bronze.png' }
      ]
    }
  ];

  get produtosFiltrados() {
    return this.produtos
      .filter(p => {
        const buscaOk = p.nome.toLowerCase().includes(this.busca.toLowerCase()) ||
                        p.ean.includes(this.busca) ||
                        p.categoria.toLowerCase().includes(this.busca.toLowerCase());
        const catOk = this.categoriaAtiva === 'Todas' || p.categoria === this.categoriaAtiva;
        return buscaOk && catOk;
      })
      .sort((a, b) => this.ordenacao === 'preco'
        ? a.menorPreco - b.menorPreco
        : a.nome.localeCompare(b.nome));
  }

  constructor(
    private toastCtrl: ToastController,
    public carrinhoService: CarrinhoService,
    private historicoService: HistoricoService
  ) {}

  ngOnInit() {}

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
      id: p.id,
      nome: p.nome,
      img: p.img,
      menorPreco: p.menorPreco,
      mercadoMaisBarato: p.mercadoMaisBarato
    });
    const t = await this.toastCtrl.create({
      message: `${p.nome} adicionado à lista! ✅`,
      duration: 2000, color: 'success', position: 'top'
    });
    await t.present();
  }

  async criarAlerta(p: Produto) {
    const t = await this.toastCtrl.create({
      message: `Alerta de preço criado para ${p.nome}! 🔔`,
      duration: 2000, color: 'primary', position: 'top'
    });
    await t.present();
  }

  naLista(id: number) { return this.carrinhoService.contem(id); }
}
