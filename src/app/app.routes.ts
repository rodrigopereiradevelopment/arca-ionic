import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then(m => m.CadastroPage)
  },
  {
    path: 'mapa-rotas',
    loadComponent: () => import('./pages/mapa-rotas/mapa-rotas.page').then(m => m.MapaRotasPage),
    canActivate: [authGuard]
  },
  {
    path: 'pesquisar-produtos',
    loadComponent: () => import('./pages/pesquisar-produtos/pesquisar-produtos.page').then(m => m.PesquisarProdutosPage),
    canActivate: [authGuard]
  },
  {
    path: 'mercados-proximos',
    loadComponent: () => import('./pages/mercados-proximos/mercados-proximos.page').then(m => m.MercadosProximosPage),
    canActivate: [authGuard]
  },
  {
    path: 'comparar',
    loadComponent: () => import('./pages/comparar/comparar.page').then(m => m.CompararPage),
    canActivate: [authGuard]
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./pages/carrinho/carrinho.page').then(m => m.CarrinhoPage),
    canActivate: [authGuard]
  },
  {
    path: 'historico',
    loadComponent: () => import('./pages/historico/historico.page').then(m => m.HistoricoPage),
    canActivate: [authGuard]
  },
  {
    path: 'notificacoes',
    loadComponent: () => import('./pages/notificacoes/notificacoes.page').then(m => m.NotificacoesPage),
    canActivate: [authGuard]
  },
  {
    path: 'ticket',
    loadComponent: () => import('./pages/ticket/ticket.page').then(m => m.TicketPage),
    canActivate: [authGuard]
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./pages/configuracoes/configuracoes.page').then(m => m.ConfiguracoesPage),
    canActivate: [authGuard]
  },
  {
    path: 'ajuda',
    loadComponent: () => import('./pages/ajuda/ajuda.page').then(m => m.AjudaPage),
    canActivate: [authGuard]
  },
  {
    path: 'termos',
    loadComponent: () => import('./pages/termos/termos.page').then(m => m.TermosPage)
  },
  {
    path: 'privacidade',
    loadComponent: () => import('./pages/privacidade/privacidade.page').then(m => m.PrivacidadePage)
  },
  {
    path: 'cadastrar-mercado',
    loadComponent: () => import('./pages/cadastrar-mercado/cadastrar-mercado.page').then(m => m.CadastrarMercadoPage),
    canActivate: [authGuard]
  },
  // ROTAS ADMIN
  {
    path: 'gerenciar-mercados',
    loadComponent: () => import('./pages/gerenciar-mercados/gerenciar-mercados.page').then(m => m.GerenciarMercadosPage),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'gerenciar-usuarios',
    loadComponent: () => import('./pages/gerenciar-usuarios/gerenciar-usuarios.page').then(m => m.GerenciarUsuariosPage),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  // ROTAS MODERADOR
  {
    path: 'gerenciar-produtos',
    loadComponent: () => import('./pages/gerenciar-produtos/gerenciar-produtos.page').then(m => m.GerenciarProdutosPage),
    canActivate: [authGuard],
    data: { roles: ['admin', 'moderador'] }
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./pages/configuracoes/configuracoes.page').then( m => m.ConfiguracoesPage)
  },
  {
    path: 'ajuda',
    loadComponent: () => import('./pages/ajuda/ajuda.page').then( m => m.AjudaPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'ajuda',
    loadComponent: () => import('./pages/ajuda/ajuda.page').then( m => m.AjudaPage)
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./pages/configuracoes/configuracoes.page').then( m => m.ConfiguracoesPage)
  }
];
