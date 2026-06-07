import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonMenu, IonContent, IonFooter, MenuController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonMenu, IonContent, IonFooter
  ]
})
export class MenuComponent {
  authService = inject(AuthService);
  private menuCtrl = inject(MenuController);


  itensUsuario = [
    { label: 'Início', rota: '/home', img: 'assets/img/inicio.png' },
    { label: 'Pesquisar Produtos', rota: '/pesquisar-produtos', img: 'assets/img/lupa1.png' },
    { label: 'Mercados Próximos', rota: '/mercados-proximos', img: 'assets/img/mercado.png' },
    { label: 'Lista Rápida', rota: '/lista-rapida', img: 'assets/img/lista.png' },
    { label: 'Favoritos', rota: '/favoritos', img: 'assets/img/cupom.svg' },
    { label: 'Comparar Preços', rota: '/comparar', img: 'assets/img/comparar.png' },
    { label: 'Meu Carrinho', rota: '/carrinho', img: 'assets/img/car.png' },
    { label: 'Cupons de Desconto', rota: '/cupons', img: 'assets/img/cupom.svg' },
    { label: 'Histórico', rota: '/historico', img: 'assets/img/historico.png' },
    { label: 'Configurações', rota: '/configuracoes', img: 'assets/img/configuracao.png' },
    { label: 'Cadastrar Mercado', rota: '/cadastrar-mercado', img: 'assets/img/cadastrarmercados.png' },
    { label: 'Ajuda e Suporte', rota: '/ajuda', img: 'assets/img/ajuda.png' }
  ];

  itensModerador = [
    { label: 'Gerenciar Denúncias', rota: '/gerenciar-denuncias', img: 'assets/img/admin.png' },
    { label: 'Gerenciar Produtos', rota: '/gerenciar-produtos', img: 'assets/img/admin.png' }
  ];

  itensAdmin = [
    { label: 'Gerenciar Mercados', rota: '/gerenciar-mercados', img: 'assets/img/admin.png' },
    { label: 'Gerenciar Usuários', rota: '/gerenciar-usuarios', img: 'assets/img/admin.png' },
    { label: 'Gerenciar Denúncias', rota: '/gerenciar-denuncias', img: 'assets/img/admin.png' },
    { label: 'Gerenciar Produtos', rota: '/gerenciar-produtos', img: 'assets/img/admin.png' }
  ];

  fecharMenu() { this.menuCtrl.close(); }

  logout() {
    this.menuCtrl.close();
    this.authService.logout();
  }
}
