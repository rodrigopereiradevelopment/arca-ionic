import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonMenu, IonContent, IonFooter, IonIcon, MenuController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  home, search, swapHorizontal, list, person,
  cart, ticket, map, heart, settings, helpCircle,
  storefront, statsChart, warning, documentText, logOut,
  ellipsisVertical, pricetag, time, hardwareChip
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonMenu, IonContent, IonFooter, IonIcon
  ]
})
export class MenuComponent {
  authService = inject(AuthService);
  private menuCtrl = inject(MenuController);

  showMais = false;

  itensPrincipais = [
    { label: 'Início', rota: '/home', icon: 'home' },
    { label: 'Buscar', rota: '/pesquisar-produtos', icon: 'search' },
    { label: 'Comparar', rota: '/comparar', icon: 'swap-horizontal' },
    { label: 'Listas', rota: '/gerenciar-listas', icon: 'list' },
    { label: 'Perfil', rota: '/perfil', icon: 'person' },
  ];

  itensMais = [
    { label: 'Mercados Próximos', rota: '/mercados-proximos', icon: 'map' },
    { label: 'Lista Rápida', rota: '/lista-rapida', icon: 'hardware-chip' },
    { label: 'Favoritos', rota: '/favoritos', icon: 'heart' },
    { label: 'Meu Carrinho', rota: '/carrinho', icon: 'cart' },
    { label: 'Cupons', rota: '/cupons', icon: 'pricetag' },
    { label: 'Histórico', rota: '/historico', icon: 'time' },
    { label: 'Configurações', rota: '/configuracoes', icon: 'settings' },
    { label: 'Cadastrar Mercado', rota: '/cadastrar-mercado', icon: 'storefront' },
    { label: 'Ajuda', rota: '/ajuda', icon: 'help-circle' },
  ];

  itensModerador = [
    { label: 'Gerenciar Tickets', rota: '/gerenciar-tickets', icon: 'ticket' },
    { label: 'Gerenciar Denúncias', rota: '/gerenciar-denuncias', icon: 'warning' },
    { label: 'Gerenciar Produtos', rota: '/gerenciar-produtos', icon: 'document-text' },
  ];

  itensAdmin = [
    { label: 'Gerenciar Mercados', rota: '/gerenciar-mercados', icon: 'storefront' },
    { label: 'Gerenciar Usuários', rota: '/gerenciar-usuarios', icon: 'stats-chart' },
  ];

  itensMercado = [
    { label: 'Painel do Mercado', rota: '/portal-mercado', icon: 'storefront' },
    { label: 'Gerenciar Produtos', rota: '/portal-mercado/produtos', icon: 'document-text' },
    { label: 'Importar CSV', rota: '/portal-mercado/importar', icon: 'document-text' },
  ];

  constructor() {
    addIcons({
      home, search, swapHorizontal, list, person,
      cart, ticket, map, heart, settings, helpCircle,
      storefront, statsChart, warning, documentText, logOut,
      ellipsisVertical, pricetag, time, hardwareChip
    });
  }

  toggleMais() {
    this.showMais = !this.showMais;
  }

  fecharMenu() { this.menuCtrl.close(); }

  logout() {
    this.menuCtrl.close();
    this.authService.logout();
  }
}
