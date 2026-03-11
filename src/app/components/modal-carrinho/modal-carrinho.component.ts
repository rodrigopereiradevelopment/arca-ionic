import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-modal-carrinho',
  templateUrl: './modal-carrinho.component.html',
  styleUrls: ['./modal-carrinho.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ModalCarrinhoComponent  implements OnInit {

  view: string = 'lista'; // Começa na visualização de lista
  produtos: any[] = [];   // Lista de produtos vazia

  constructor() { }

  ngOnInit() {}

  fecharModal() {
    console.log('Fechando modal...');
    // Aqui você adicionaria o código para fechar o modal do Ionic
  }

}
