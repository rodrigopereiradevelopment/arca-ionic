import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonContent,
  IonFooter,
  IonList,
  IonItem,
  IonLabel,
  IonItemDivider,
  MenuController
} from '@ionic/angular/standalone'; // ← standalone, não IonicModule!

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonContent,
    IonFooter,
    IonList,
    IonItem,
    IonLabel,
    IonItemDivider,
  ]
})
export class MenuComponent implements OnInit {

  usuario = {
    nome: 'Nome do Usuário',
    email: 'email@exemplo.com'
  };

  isAdmin = true;

  constructor(
    private menuCtrl: MenuController,
    private router: Router
  ) {}

  ngOnInit() {}

  logout() {
    this.menuCtrl.close();
    this.router.navigate(['/login']);
  }

  fecharMenu() {
    this.menuCtrl.close();
  }
}