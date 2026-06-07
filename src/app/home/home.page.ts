import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonSearchbar } from '@ionic/angular/standalone';
import { FooterComponent } from '../components/footer/footer.component';
import { ModalCarrinhoComponent } from '../components/modal-carrinho/modal-carrinho.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonSearchbar,
    FooterComponent,
    ModalCarrinhoComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage {
  private router = inject(Router);


  buscar(event: any) {
    const target = event?.target as HTMLInputElement | null;
    const q = (target?.value ?? '').trim();
    if (q.length >= 2) {
      this.router.navigate(['/pesquisar-produtos'], { queryParams: { q } });
    }
  }
}