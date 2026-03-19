import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  constructor() {}
}