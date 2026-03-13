import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  ModalController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-modal-carrinho',
  templateUrl: './modal-carrinho.component.html',
  styleUrls: ['./modal-carrinho.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent
  ]
})
export class ModalCarrinhoComponent implements OnInit {

  view: string = 'lista';
  produtos: any[] = [
    { nome: 'Café Tradicional 3 Corações' },
    { nome: 'Açúcar Refinado União' }
  ];

  constructor(
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  verRotas() {
    this.modalCtrl.dismiss();
    this.router.navigate(['/mapa-rotas']);
  }
}