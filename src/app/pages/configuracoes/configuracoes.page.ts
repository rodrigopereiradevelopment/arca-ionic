import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController, AlertController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { HistoricoService } from '../../services/historico.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class ConfiguracoesPage implements OnInit {
  authService = inject(AuthService);
  carrinhoService = inject(CarrinhoService);
  historicoService = inject(HistoricoService);
  private configSvc = inject(ConfigService);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);


  get aparencia() { return this.configSvc.config.aparencia; }
  get acessibilidade() { return this.configSvc.config.acessibilidade; }
  get localizacao() { return this.configSvc.config.localizacao; }
  get notificacoes() { return this.configSvc.config.notificacoes; }
  get preferencias() { return this.configSvc.config.preferencias; }
  get privacidade() { return this.configSvc.config.privacidade; }

  tamanhosFonte = [
    { value: 'pequeno', label: 'Pequeno', size: '13px' },
    { value: 'medio', label: 'Médio', size: '16px' },
    { value: 'grande', label: 'Grande', size: '20px' },
    { value: 'extra', label: 'Extra Grande', size: '24px' }
  ];

  ngOnInit() { this.configSvc.init(); }

  async onToggle() {
    this.configSvc.salvar();
    this.configSvc.aplicar();
    await this.toast('Configuração salva!', 'success');
  }

  async confirmarLimparHistorico() {
    const alert = await this.alertCtrl.create({
      header: 'Limpar Histórico',
      message: 'Deseja apagar todo o histórico?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Limpar', role: 'destructive', handler: async () => {
          this.historicoService.limpar();
          await this.toast('Histórico limpo!', 'warning');
        }}
      ]
    });
    await alert.present();
  }

  async confirmarLimparLista() {
    const alert = await this.alertCtrl.create({
      header: 'Limpar Lista',
      message: 'Deseja remover todos os produtos da lista?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Limpar', role: 'destructive', handler: async () => {
          this.carrinhoService.lista.forEach(i => this.carrinhoService.remover(i.id));
          await this.toast('Lista limpa!', 'warning');
        }}
      ]
    });
    await alert.present();
  }

  async resetarConfiguracoes() {
    const alert = await this.alertCtrl.create({
      header: 'Resetar Configurações',
      message: 'Restaurar todas as configurações para o padrão?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Resetar', role: 'destructive', handler: async () => {
          this.configSvc.resetar();
          await this.toast('Configurações resetadas!', 'success');
        }}
      ]
    });
    await alert.present();
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color, position: 'top' });
    await t.present();
  }
}
