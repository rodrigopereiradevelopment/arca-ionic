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
}
];
