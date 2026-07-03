import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonSpinner, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, ToastController, IonList, IonItem, IonLabel, IonIcon, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { ComparacaoService } from '../../services/comparacao.service';
import { HistoricoListasService } from '../../services/historico-listas.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

const CONCORRENCIA_BUSCA = 10;

@Component({
  selector: 'app-lista-rapida',
  templateUrl: './lista-rapida.page.html',
  styleUrls: ['./lista-rapida.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonSpinner, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonIcon, IonProgressBar]
})
export class ListaRapidaPage {
  private comparacaoService = inject(ComparacaoService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private historicoSvc = inject(HistoricoListasService);
  protected auth = inject(AuthService);

  textoLista = '';
  buscando = false;
  buscandoProgresso = 0;
  buscandoTotal = 0;
  erros: string[] = [];
  produtosEncontrados: any[] = [];

  constructor() {
    addIcons({ saveOutline });
  }

  private async buscarProdutos(): Promise<any[]> {
    const linhas = this.textoLista.split('\n').map(l => l.trim()).filter(l => l.length > 1);
    if (linhas.length === 0) return [];
    this.buscando = true;
    this.buscandoTotal = linhas.length;
    this.buscandoProgresso = 0;
    this.erros = [];
    this.produtosEncontrados = [];
    this.comparacaoService.limpar();

    const encontrados: any[] = [];
    const erros: string[] = [];

    for (let i = 0; i < linhas.length; i += CONCORRENCIA_BUSCA) {
      const batch = linhas.slice(i, i + CONCORRENCIA_BUSCA);

      const results = await Promise.all(
        batch.map(async linha => {
          try {
            const res = await fetch(environment.apiUrl + '/api/produtos/search?q=' + encodeURIComponent(linha));
            const json = await res.json();
            const produtos = json?.data || [];
            return { linha, produto: produtos.length > 0 ? produtos[0] : null };
          } catch {
            return { linha, produto: null };
          }
        })
      );

      for (const r of results) {
        if (r.produto) {
          this.comparacaoService.adicionar(r.produto);
          encontrados.push(r.produto);
        } else {
          erros.push(r.linha);
        }
      }

      this.buscandoProgresso += batch.length;
      this.produtosEncontrados = [...encontrados];
      this.erros = [...erros];
    }

    this.buscando = false;
    return encontrados;
  }

  async buscarEComparar() {
    const encontrados = await this.buscarProdutos();
    if (encontrados.length === 0) {
      const t = await this.toastCtrl.create({ message: 'Nenhum produto encontrado', duration: 3000, color: 'warning', position: 'top' });
      await t.present();
      return;
    }
    this.router.navigate(['/comparar']);
  }

  async salvarLista() {
    const encontrados = await this.buscarProdutos();
    if (encontrados.length === 0) {
      const t = await this.toastCtrl.create({ message: 'Nenhum produto encontrado', duration: 3000, color: 'warning', position: 'top' });
      await t.present();
      return;
    }
    const itens = encontrados.map(p => ({
      produto_id: p.id,
      nome: p.nome,
      img: p.imagem_url || '',
      quantidade: 1,
      menorPreco: 0,
      mercadoMaisBarato: '',
    }));
    const salva = await this.historicoSvc.salvar('Lista Rápida', itens);
    if (salva) {
      const t = await this.toastCtrl.create({ message: 'Lista salva!', duration: 3000, color: 'success', position: 'top' });
      await t.present();
    } else {
      const t = await this.toastCtrl.create({ message: 'Erro ao salvar lista. Faca login primeiro.', duration: 3000, color: 'danger', position: 'top' });
      await t.present();
    }
  }
}
