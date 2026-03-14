import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  IonButton, IonContent, IonList, IonItem,
  IonLabel, IonCard, IonCardContent, ModalController
} from '@ionic/angular/standalone';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-modal-carrinho',
  templateUrl: './modal-carrinho.component.html',
  styleUrls: ['./modal-carrinho.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonButton, IonContent, IonList, IonItem,
    IonLabel, IonCard, IonCardContent
  ]
})
export class ModalCarrinhoComponent implements OnInit {

  view: string = 'lista';

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    public carrinhoService: CarrinhoService
  ) {}

  ngOnInit() {}

  fecharModal() { this.modalCtrl.dismiss(); }

  remover(id: number) { this.carrinhoService.remover(id); }

  verRotas() {
    this.modalCtrl.dismiss();
    this.router.navigate(['/mapa-rotas']);
  }
}
