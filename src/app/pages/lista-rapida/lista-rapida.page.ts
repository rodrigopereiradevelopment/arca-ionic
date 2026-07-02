import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonSpinner, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, ToastController, IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { ComparacaoService } from '../../services/comparacao.service';
import { HistoricoListasService } from '../../services/historico-listas.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-lista-rapida',
  templateUrl: './lista-rapida.page.html',
  styleUrls: ['./lista-rapida.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonSpinner, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonIcon]
})
export class ListaRapidaPage {
  private comparacaoService = inject(ComparacaoService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private historicoSvc = inject(HistoricoListasService);
  protected auth = inject(AuthService);

  textoLista = '';
  buscando = false;
  erros: string[] = [];
  produtosEncontrados: any[] = [];

  constructor() {
    addIcons({ saveOutline });
  }

  private async buscarProdutos(): Promise<any[]> {
    const linhas = this.textoLista.split('\n').map(l => l.trim()).filter(l => l.length > 1);
    if (linhas.length === 0) return [];
    this.buscando = true;
    this.erros = [];
    this.produtosEncontrados = [];
    this.comparacaoService.limpar();
    for (const linha of linhas) {
      try {
        const res = await fetch(environment.apiUrl + '/api/produtos/search?q=' + encodeURIComponent(linha));
        const json = await res.json();
        const produtos = json?.data || [];
        if (produtos.length > 0) {
          this.comparacaoService.adicionar(produtos[0]);
          this.produtosEncontrados.push(produtos[0]);
        } else {
          this.erros.push(linha);
        }
      } catch {
        this.erros.push(linha);
      }
    }
    this.buscando = false;
    return this.produtosEncontrados;
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