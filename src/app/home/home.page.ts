import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ModalCarrinhoComponent } from '../components/modal-carrinho/modal-carrinho.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    HeaderComponent, 
    FooterComponent, 
    ModalCarrinhoComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Isso aqui é o que resolve o erro do terminal!
})
export class HomePage {
  constructor() {}
}