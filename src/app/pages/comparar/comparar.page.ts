import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { ComparacaoService } from '../../services/comparacao.service';
import { environment } from '../../../environments/environment';

interface MercadoComPreco {
  id: number; nome: string; logo: string; posicao: string; preco: number; precoFormatado: string;
}

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

  private readonly SUPERMERCADOS: Record<number, { nome: string; logo: string }> = {
    1: { nome: 'GoodBom',     logo: 'assets/img/goodbom.png' },
    2: { nome: 'PagueMenos',  logo: 'assets/img/paguemenos.png' },
    3: { nome: 'Sao Vicente', logo: 'assets/img/saovicente.png' },
    4: { nome: 'Atacadao',    logo: 'assets/img/atacadao.png' },
    5: { nome: 'Imperial',    logo: 'assets/img/imperial.png' },
    6: { nome: 'Ponto Novo',  logo: 'assets/img/pontonovo.jpeg' }
  };

  constructor(private comparacaoService: ComparacaoService, private toastCtrl: ToastController) {}

  async ionViewWillEnter() {
    this.produtosSelecionados = this.comparacaoService.getProdutos();
    console.log('DEBUG ionViewWillEnter - produtos:', this.produtosSelecionados.length);
    if (this.produtosSelecionados.length === 0) {
      this.mostrarToast('Nenhum produto selecionado', 'warning');
      this.loading = false;
      return;
    }
    await this.calcularCesta();
  }

  async calcularCesta() {
    this.loading = true;
    this.mercados = [];
    try {
      const entradas = Object.entries(this.SUPERMERCADOS);
      const resultados = await Promise.all(
        entradas.map(async ([id, info]) => {
          const mercadoId = Number(id);
          const precos = await Promise.all(
            this.produtosSelecionados.map(async (produto) => {
              let preco = await this.buscarPreco(
                '/api/produtos/preco',
                'produtoId=' + produto.id + '&mercadoId=' + mercadoId
              );
              if (preco === 0) {
                preco = await this.buscarPreco(
                  '/api/produtos/preco-similar',
                  'nome=' + encodeURIComponent(produto.nome) + '&mercadoId=' + mercadoId
                );
              }
              return preco;
            })
          );
          const total = precos.reduce((a, b) => a + b, 0);
          return { id: mercadoId, nome: info.nome, logo: info.logo, preco: total };
        })
      );
      const comDados = resultados.filter(r => r.preco > 0).sort((a, b) => a.preco - b.preco);
      const semDados = resultados.filter(r => r.preco === 0);
      console.log('DEBUG comDados:', comDados.length, 'semDados:', semDados.length);
      this.mercados = [...comDados, ...semDados].map((r, i) => ({
        ...r,
        posicao: i === 0 && r.preco > 0 ? 'assets/img/ouro.png'
               : i === 1 && r.preco > 0 ? 'assets/img/prata.png'
               : i === 2 && r.preco > 0 ? 'assets/img/bronze.png' : '',
        precoFormatado: r.preco > 0 ? 'R$ ' + r.preco.toFixed(2) : 'Sem dados'
      }));
    } catch (e) {
      console.error('ERRO calcularCesta:', e);
    } finally {
      this.loading = false;
    }
  }

  async buscarPreco(rota: string, params: string): Promise<number> {
    try {
      const res = await fetch(environment.apiUrl + rota + '?' + params);
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

  private async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }
}