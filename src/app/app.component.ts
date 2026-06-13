import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { MenuComponent } from './components/menu/menu.component';
import { AuthService } from './services/auth.service';
import { ConfigService } from './services/config.service';
import { CarrinhoService } from './services/carrinho.service';
import { PushNotificationService } from './services/push-notification.service';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

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
  private authService = inject(AuthService);
  private configService = inject(ConfigService);
  private carrinhoService = inject(CarrinhoService);
  private pushService = inject(PushNotificationService);
  private router = inject(Router);


  async ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: false });
      StatusBar.setStyle({ style: 'DARK' });
    }

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

    const onboardingOk = localStorage.getItem('onboarding_completo');
    if (!onboardingOk && !window.location.hash.includes('access_token')) {
      setTimeout(() => this.router.navigate(['/onboarding']), 2200);
    }

    this.authService.usuario$.subscribe(async u => {
      if (u) {
        this.carrinhoService.carregarDoServidor();
        await this.configService.carregarDoServidor();
        if (this.configService.config.notificacoes.push) {
          this.pushService.registrar();
        }
      }
    });
  }
}