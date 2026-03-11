import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class FooterComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  abrirCarrinho() {
    console.log('Carrinho aberto!');
  }

}
