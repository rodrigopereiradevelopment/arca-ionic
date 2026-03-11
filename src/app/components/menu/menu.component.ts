import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class MenuComponent  implements OnInit {

  sugestoes: any[] = []; // Define que sugestoes é uma lista vazia

  constructor() { }

  ngOnInit() {}

  // Adicione a função que o HTML chama
  selecionar(item: any) {
    console.log('Item selecionado:', item);
  }
}
