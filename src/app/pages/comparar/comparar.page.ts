import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { ComparacaoService } from '../../services/comparacao.service';
import { environment } from '../../../environments/environment';

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

  // NOVO: Usa o endpoint /api/comparar em lote (UMA única chamada)
  async calcularCesta() {
    this.loading = true;
    this.mercados = [];
    
    try {
      // Prepara a lista de produtos com quantidades
      const produtosPayload = this.produtosSelecionados.map(p => ({
        id: p.id,
        nome: p.nome,
        quantidade: p.quantidade || 1
      }));

      console.log('📦 Enviando para comparação:', produtosPayload);

      // Única chamada à API
      const response = await fetch(`${environment.apiUrl}/api/comparar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtos: produtosPayload })
      });

      const data = await response.json();
      console.log('📊 Resposta da API:', data);

      if (data.sucesso && data.mercados) {
        // Mapeia a resposta para o formato da interface
        this.mercados = data.mercados.map((m: any, i: number) => {
          // Busca a logo pelo ID do mercado
          const mercadoInfo = this.SUPERMERCADOS[m.id];
          
          // Processa os produtos para o formato esperado
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
            posicao: i === 0 && m.total > 0 ? 'assets/img/ouro.png'
                   : i === 1 && m.total > 0 ? 'assets/img/prata.png'
                   : i === 2 && m.total > 0 ? 'assets/img/bronze.png' : '',
            expandido: false,
            produtos: produtosDetalhe
          };
        });
        
        console.log('✅ Mercados processados:', this.mercados.length);
      } else {
        console.error('❌ Erro na resposta da API:', data);
        this.mostrarToast('Erro ao comparar preços', 'danger');
      }
      
    } catch (error) {
      console.error('❌ Erro ao chamar /api/comparar:', error);
      this.mostrarToast('Erro de conexão com o servidor', 'danger');
    } finally {
      this.loading = false;
    }
  }

  // Remove os métodos antigos (buscarPreco não é mais necessário)
  // async buscarPreco(rota: string, params: string): Promise<number> { ... }  // REMOVA ESTE

  limparSelecao() {
    this.comparacaoService.limpar();
    this.mercados = [];
    this.produtosSelecionados = [];
  }

  // Expande/colapsa o card
  toggleExpandir(mercado: MercadoComPreco) {
    mercado.expandido = !mercado.expandido;
  }

  private async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }
}