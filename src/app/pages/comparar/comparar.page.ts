import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-comparar',
  templateUrl: './comparar.page.html',
  styleUrls: ['./comparar.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonButton]
})
export class CompararPage implements OnInit {
  mercados = [
    { posicao: 'assets/img/ouro.png', logo: 'assets/img/BigBom-Icon.png', nome: 'Big Bom', preco: 'R$ 102,24' },
    { posicao: 'assets/img/prata.png', logo: 'assets/img/SMC.png', nome: 'SMC', preco: 'R$ 107,68' },
    { posicao: 'assets/img/bronze.png', logo: 'assets/img/spn.png', nome: 'SPN', preco: 'R$ 112,80' }
  ];
  constructor() {}
  ngOnInit() {}
}
