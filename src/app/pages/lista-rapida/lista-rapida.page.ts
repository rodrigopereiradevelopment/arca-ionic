import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonSpinner, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, ToastController } from '@ionic/angular/standalone';
import { ComparacaoService } from '../../services/comparacao.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-lista-rapida',
  templateUrl: './lista-rapida.page.html',
  styleUrls: ['./lista-rapida.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonSpinner, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton]
})
export class ListaRapidaPage {
  private comparacaoService = inject(ComparacaoService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  textoLista = '';
  buscando = false;
  erros: string[] = [];

  async buscarEComparar() {
    const linhas = this.textoLista.split('\n').map(l => l.trim()).filter(l => l.length > 1);
    if (linhas.length === 0) return;
    this.buscando = true;
    this.erros = [];
    this.comparacaoService.limpar();
    for (const linha of linhas) {
      try {
        const res = await fetch(environment.apiUrl + '/api/produtos/search?q=' + encodeURIComponent(linha));
        const json = await res.json();
        const produtos = json?.data || [];
        if (produtos.length > 0) {
          this.comparacaoService.adicionar(produtos[0]);
        } else {
          this.erros.push(linha);
        }
      } catch {
        this.erros.push(linha);
      }
    }
    this.buscando = false;
    if (this.comparacaoService.getQuantidade() === 0) {
      const t = await this.toastCtrl.create({ message: 'Nenhum produto encontrado', duration: 3000, color: 'warning', position: 'top' });
      await t.present();
      return;
    }
    this.router.navigate(['/comparar']);
  }
}