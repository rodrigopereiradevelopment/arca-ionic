import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonFooter,
  IonToolbar,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ticketOutline, homeOutline, cartOutline, notificationsOutline, personOutline } from 'ionicons/icons';
import { ModalCarrinhoComponent } from '../modal-carrinho/modal-carrinho.component';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonFooter,
    IonToolbar,
    IonButton,
    IonIcon,
    ModalCarrinhoComponent
  ]
})
export class FooterComponent implements OnInit {

  constructor(private modalCtrl: ModalController) {
    addIcons({ ticketOutline, homeOutline, cartOutline, notificationsOutline, personOutline });
  }

  ngOnInit() {}

  async abrirCarrinho() {
    const modal = await this.modalCtrl.create({
      component: ModalCarrinhoComponent,
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 0.5,
      handle: true
    });
    await modal.present();
  }
}