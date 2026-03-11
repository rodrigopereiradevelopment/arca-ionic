import { Component, OnInit } from '@angular/core'; // 1. Adicione o OnInit
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit { // 2. Implemente o OnInit
  
  constructor() {}

  // 3. O código agora fica DENTRO da classe
  ngOnInit() {
    setTimeout(() => {
      const overlay = document.getElementById('intro-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 1000); 
      }
    }, 2000); 
  }
}