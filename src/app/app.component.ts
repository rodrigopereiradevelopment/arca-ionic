import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { MenuComponent } from './components/menu/menu.component';
import { AuthService } from './services/auth.service';
import { ConfigService } from './services/config.service';
import { CarrinhoService } from './services/carrinho.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp,
    IonRouterOutlet,
    MenuComponent
  ],
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private carrinhoService: CarrinhoService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.configService.init();

    // Intro overlay
    setTimeout(() => {
      const overlay = document.getElementById('intro-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 1000);
      }
    }, 2000);
    
// Captura token OAuth do redirect do Supabase
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const token = params.get('access_token');
      if (token) {
        window.history.replaceState({}, document.title, window.location.pathname);
        const ok = await this.authService.loginComToken(token);
        if (ok) {
          this.router.navigate(['/home']);
        }
      }
    }

    if (this.authService.logado) {
      this.carrinhoService.carregarDoServidor();
    }

    this.authService.usuario$.subscribe(u => {
      if (u) this.carrinhoService.carregarDoServidor();
    });
  }
}