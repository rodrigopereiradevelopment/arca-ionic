import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, AlertController } from '@ionic/angular/standalone';
import { MenuComponent } from './components/menu/menu.component';
import { AuthService } from './services/auth.service';
import { ConfigService } from './services/config.service';
import { CarrinhoService } from './services/carrinho.service';
import { PushNotificationService } from './services/push-notification.service';
import { Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { UpdateService } from './services/update.service';

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
  private updateService = inject(UpdateService);
  private alertCtrl = inject(AlertController);


  async ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setStyle({ style: Style.Dark });
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

    setTimeout(() => this.verificarAtualizacao(), 5000);
  }

  private async verificarAtualizacao(tentativa = 1) {
    const { update, erro } = await this.updateService.verificar();
    if (update) {
      const alert = await this.alertCtrl.create({
        header: 'Nova versão disponível',
        subHeader: `ARCA v${update.versao}`,
        message: update.mensagem,
        buttons: [
          { text: 'Depois', role: 'cancel' },
          {
            text: 'Atualizar agora',
            handler: () => { window.open(update.url, '_system'); },
          },
        ],
      });
      await alert.present();
    } else if (erro && tentativa < 3) {
      setTimeout(() => this.verificarAtualizacao(tentativa + 1), 30000);
    }
  }
}