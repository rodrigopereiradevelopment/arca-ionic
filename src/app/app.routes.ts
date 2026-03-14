import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
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
    loadComponent: () => import('./pages/mapa-rotas/mapa-rotas.page').then(m => m.MapaRotasPage)
  },
  {
    path: 'termos',
    loadComponent: () => import('./pages/termos/termos.page').then( m => m.TermosPage)
  },
  {
  path: 'privacidade',
  loadComponent: () => import('./pages/privacidade/privacidade.page').then(m => m.PrivacidadePage)
},
  {
    path: 'comparar',
    loadComponent: () => import('./pages/comparar/comparar.page').then( m => m.CompararPage)
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./pages/carrinho/carrinho.page').then( m => m.CarrinhoPage)
  },
  {
    path: 'cadastrar-mercado',
    loadComponent: () => import('./pages/cadastrar-mercado/cadastrar-mercado.page').then( m => m.CadastrarMercadoPage)
  },
  {
    path: 'gerenciar-mercados',
    loadComponent: () => import('./pages/gerenciar-mercados/gerenciar-mercados.page').then( m => m.GerenciarMercadosPage)
  },
  {
    path: 'gerenciar-produtos',
    loadComponent: () => import('./pages/gerenciar-produtos/gerenciar-produtos.page').then( m => m.GerenciarProdutosPage)
  },
  {
    path: 'gerenciar-usuarios',
    loadComponent: () => import('./pages/gerenciar-usuarios/gerenciar-usuarios.page').then( m => m.GerenciarUsuariosPage)
  },
  {
    path: 'mercados-proximos',
    loadComponent: () => import('./pages/mercados-proximos/mercados-proximos.page').then( m => m.MercadosProximosPage)
  },
  {
    path: 'pesquisar-produtos',
    loadComponent: () => import('./pages/pesquisar-produtos/pesquisar-produtos.page').then( m => m.PesquisarProdutosPage)
  },
  {
    path: 'historico',
    loadComponent: () => import('./pages/historico/historico.page').then( m => m.HistoricoPage)
  }
];
