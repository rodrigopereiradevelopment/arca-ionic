import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // ESSA LINHA É CRUCIAL PARA PRODUÇÃO
})
export class HeaderComponent implements OnInit {
  sugestoes: any[] = []; 
  constructor() { }
  ngOnInit() {}

  buscar(event: any) {
    const query = event.target.value;
    console.log('Buscando por:', query);
    // Simulação para testar se aparece algo
    this.sugestoes = query.length > 0 ? [{nome: 'Teste'}] : [];
  }

  selecionar(item: any) {
    console.log('Selecionado:', item);
    this.sugestoes = [];
  }
}
