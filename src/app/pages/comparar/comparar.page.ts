import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { ComparacaoService } from '../../services/comparacao.service';
import { environment } from '../../../environments/environment';

interface MercadoComPreco {
  id: number;
  nome: string;
  logo: string;
  posicao: string;
  preco: number;
  precoFormatado: string;
}

@Component({
  selector: 'app-comparar',
  templateUrl: './comparar.page.html',
  styleUrls: ['./comparar.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonSpinner]
})
export class CompararPage implements OnInit {
  mercados: MercadoComPreco[] = [];
  loading = true;
  produtosSelecionados: any[] = [];

  private readonly SUPERMERCADOS: Record<number, { nome: string; logo: string }> = {
    1: { nome: 'GoodBom',     logo: 'assets/img/goodbom.png' },
    2: { nome: 'PagueMenos',  logo: 'assets/img/paguemenos.png' },
    3: { nome: 'São Vicente', logo: 'assets/img/saovicente.png' },
    4: { nome: 'Atacadão',    logo: 'assets/img/atacadao.png' },
    5: { nome: 'Imperial',    logo: 'assets/img/imperial.png' },
    6: { nome: 'Ponto Novo',  logo: 'assets/img/pontonovo.jpeg' }
  };

  constructor(
    private comparacaoService: ComparacaoService,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.produtosSelecionados = this.comparacaoService.getProdutos();
    if (this.produtosSelecionados.length === 0) {
      this.mostrarToast('Nenhum produto selecionado', 'warning');
      this.loading = false;
      return;
    }
    await this.calcularCesta();
  }

  async calcularCesta() {
    this.loading = true;
    const resultados = [];

    for (const [id, info] of Object.entries(this.SUPERMERCADOS)) {
      let total = 0;
      for (const produto of this.produtosSelecionados) {
        total += await this.buscarPreco(produto.id, Number(id));
      }
      resultados.push({ id: Number(id), nome: info.nome, logo: info.logo, preco: total });
    }

    resultados.sort((a, b) => a.preco - b.preco);

    this.mercados = resultados.map((r, i) => ({
      ...r,
      posicao: i === 0 ? 'assets/img/ouro.png' : i === 1 ? 'assets/img/prata.png' : i === 2 ? 'assets/img/bronze.png' : '',
      precoFormatado: `R$ ${r.preco.toFixed(2)}`
    }));

    this.loading = false;
  }

  async buscarPreco(produtoId: number, mercadoId: number): Promise<number> {
    try {
      const res = await fetch(
        `${environment.apiUrl}/api/produtos/preco?produtoId=${produtoId}&mercadoId=${mercadoId}`
      );
      const data = await res.json();
      return data.preco || 0;
    } catch {
      return 0;
    }
  }

  limparSelecao() {
    this.comparacaoService.limpar();
    this.mercados = [];
    this.produtosSelecionados = [];
  }

  private async mostrarToast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 3000, color, position: 'top' });
    await t.present();
  }
}
