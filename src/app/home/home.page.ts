import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonSearchbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search, cart, swapHorizontal, list, helpCircle, time, chevronForward } from 'ionicons/icons';
import { FooterComponent } from '../components/footer/footer.component';
import { ModalCarrinhoComponent } from '../components/modal-carrinho/modal-carrinho.component';
import { HistoricoService, ItemHistorico } from '../services/historico.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonSearchbar,
    IonIcon,
    IonButton,
    FooterComponent,
    ModalCarrinhoComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage {
  private router = inject(Router);
  private historicoService = inject(HistoricoService);

  historico: ItemHistorico[] = [];
  buscaQuery = '';

  passos = [
    { icone: 'search', titulo: 'Busque', descricao: 'Digite o produto que deseja comparar' },
    { icone: 'cart', titulo: 'Adicione', descricao: 'Monte sua lista de compras' },
    { icone: 'swap-horizontal', titulo: 'Compare', descricao: 'Veja o menor preço em cada mercado' },
  ];

  ionViewWillEnter() {
    this.historicoService.itens$.subscribe(itens => {
      this.historico = itens.slice(0, 5);
    });
  }

  buscar() {
    const q = this.buscaQuery.trim();
    if (q.length >= 2) {
      this.router.navigate(['/pesquisar-produtos'], { queryParams: { q } });
    }
  }

  irPara(rota: string) {
    this.router.navigate([rota]);
  }

  formatarData(data: Date): string {
    const d = new Date(data);
    const agora = new Date();
    const diffMs = agora.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'Agora';
    if (diffMin < 60) return `${diffMin}min`;
    const diffHoras = Math.floor(diffMin / 60);
    if (diffHoras < 24) return `${diffHoras}h`;
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }
}
