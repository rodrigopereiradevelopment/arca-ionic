import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common'; 
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HeaderComponent  implements OnInit {
  
  // ADICIONE ESTAS DUAS LINHAS:
  sugestoes: any[] = []; 

  constructor() { }

  ngOnInit() {}

  buscar(event: any) {
    const query = event.target.value;
    console.log('Buscando por:', query);
  }

  // ADICIONE ESTA FUNÇÃO:
  selecionar(item: any) {
    console.log('Selecionado:', item);
  }
}