import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController, AlertController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { HistoricoService } from '../../services/historico.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class ConfiguracoesPage implements OnInit {

  aparencia = { modoEscuro: false, altoContraste: false };

  acessibilidade = {
    tamanhoFonte: 'medio',
    negrito: false,
    reduzirAnimacoes: false,
    leitorTela: false,
    espacamentoLinhas: 'normal'
  };

  localizacao = { automatica: true, raio: 10 };

  notificacoes = { alertasPreco: true, promocoes: true, email: false, push: true };

  preferencias = { ordenacaoPadrao: 'preco', apenasAprovados: true };

  privacidade = { salvarHistorico: true, dadosAnonimos: false };

  tamanhosFonte = [
    { value: 'pequeno', label: 'Pequeno', size: '13px' },
    { value: 'medio', label: 'Médio', size: '16px' },
    { value: 'grande', label: 'Grande', size: '20px' },
    { value: 'extra', label: 'Extra Grande', size: '24px' }
  ];

  constructor(
    public authService: AuthService,
    public carrinhoService: CarrinhoService,
    public historicoService: HistoricoService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() { this.carregarConfiguracoes(); }

  carregarConfiguracoes() {
    const salvo = localStorage.getItem('arca_config');
    if (salvo) {
      const config = JSON.parse(salvo);
      this.aparencia = config.aparencia || this.aparencia;
      this.acessibilidade = config.acessibilidade || this.acessibilidade;
      this.localizacao = config.localizacao || this.localizacao;
      this.notificacoes = config.notificacoes || this.notificacoes;
      this.preferencias = config.preferencias || this.preferencias;
      this.privacidade = config.privacidade || this.privacidade;
    }
    this.aplicarConfiguracoes();
  }

  salvarConfiguracoes() {
    localStorage.setItem('arca_config', JSON.stringify({
      aparencia: this.aparencia,
      acessibilidade: this.acessibilidade,
      localizacao: this.localizacao,
      notificacoes: this.notificacoes,
      preferencias: this.preferencias,
      privacidade: this.privacidade
    }));
    this.aplicarConfiguracoes();
  }

  aplicarConfiguracoes() {
    const body = document.body;
    this.aparencia.modoEscuro ? body.classList.add('dark') : body.classList.remove('dark');
    this.aparencia.altoContraste ? body.classList.add('alto-contraste') : body.classList.remove('alto-contraste');
    this.acessibilidade.reduzirAnimacoes ? body.classList.add('sem-animacoes') : body.classList.remove('sem-animacoes');
    const fonte = this.tamanhosFonte.find(f => f.value === this.acessibilidade.tamanhoFonte);
    if (fonte) document.documentElement.style.setProperty('--font-size-base', fonte.size);
    document.documentElement.style.setProperty('--font-weight-base', this.acessibilidade.negrito ? '700' : '400');
    document.documentElement.style.setProperty('--line-height-base', this.acessibilidade.espacamentoLinhas === 'amplo' ? '2' : '1.5');
  }

  async onToggle() {
    this.salvarConfiguracoes();
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
          localStorage.removeItem('arca_config');
          this.aparencia = { modoEscuro: false, altoContraste: false };
          this.acessibilidade = { tamanhoFonte: 'medio', negrito: false, reduzirAnimacoes: false, leitorTela: false, espacamentoLinhas: 'normal' };
          this.localizacao = { automatica: true, raio: 10 };
          this.notificacoes = { alertasPreco: true, promocoes: true, email: false, push: true };
          this.preferencias = { ordenacaoPadrao: 'preco', apenasAprovados: true };
          this.privacidade = { salvarHistorico: true, dadosAnonimos: false };
          this.aplicarConfiguracoes();
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
