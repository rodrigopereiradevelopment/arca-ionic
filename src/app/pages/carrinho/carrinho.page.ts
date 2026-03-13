import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent]
})
export class CarrinhoPage implements OnInit {
  produtos = [
    { nome: 'Café Tradicional 3 Corações', img: 'assets/img/Produto 1.png' },
    { nome: 'Açúcar Refinado União', img: 'assets/img/Produto 2.png' },
    { nome: 'Arroz Branco Prato Fino', img: 'assets/img/Produto 3.png' }
  ];
  constructor() {}
  ngOnInit() {}
}
