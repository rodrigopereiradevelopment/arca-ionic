import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, AlertController, ToastController } from '@ionic/angular/standalone';

interface Notificacao {
  id: number;
  tipo: 'preco' | 'promocao' | 'sistema' | 'alerta';
  titulo: string;
  mensagem: string;
  data: Date;
  lida: boolean;
  icone: string;
  rota?: string;
}

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.page.html',
  styleUrls: ['./notificacoes.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent]
})
export class NotificacoesPage implements OnInit {

  filtroAtivo: 'todas' | 'preco' | 'promocao' | 'sistema' | 'alerta' = 'todas';

  notificacoes: Notificacao[] = [
    {
      id: 1, tipo: 'preco',
      titulo: 'Alerta de Preço! 🎯',
      mensagem: 'Café 3 Corações baixou para R$ 16,90 no Big Bom!',
      data: new Date(), lida: false, icone: '💰',
      rota: '/pesquisar-produtos'
    },
    {
      id: 2, tipo: 'promocao',
      titulo: 'Promoção Especial! 🏷️',
      mensagem: 'Arroz Prato Fino com 20% de desconto no SMC só hoje!',
      data: new Date(Date.now() - 3600000), lida: false, icone: '🏷️',
      rota: '/pesquisar-produtos'
    },
    {
      id: 3, tipo: 'alerta',
      titulo: 'Sua lista está pronta! 🛒',
      mensagem: 'Você tem 3 produtos na lista. Clique para comparar preços.',
      data: new Date(Date.now() - 7200000), lida: true, icone: '🛒',
      rota: '/comparar'
    },
    {
      id: 4, tipo: 'sistema',
      titulo: 'Bem-vindo ao ARCA! 👋',
      mensagem: 'Comece pesquisando produtos e economize nas suas compras!',
      data: new Date(Date.now() - 86400000), lida: true, icone: '📱',
      rota: '/home'
    },
    {
      id: 5, tipo: 'preco',
      titulo: 'Menor preço encontrado! 📉',
      mensagem: 'Açúcar União 1kg por R$ 4,49 no SPN — menor preço da semana!',
      data: new Date(Date.now() - 172800000), lida: true, icone: '📉',
      rota: '/pesquisar-produtos'
    }
  ];

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  get notificacoesFiltradas() {
    const lista = this.filtroAtivo === 'todas'
      ? this.notificacoes
      : this.notificacoes.filter(n => n.tipo === this.filtroAtivo);
    return lista.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  get naoLidas() {
    return this.notificacoes.filter(n => !n.lida).length;
  }

  marcarLida(n: Notificacao) {
    n.lida = true;
  }

  marcarTodasLidas() {
    this.notificacoes.forEach(n => n.lida = true);
  }

  remover(n: Notificacao) {
    this.notificacoes = this.notificacoes.filter(x => x.id !== n.id);
  }

  async confirmarLimpar() {
    const alert = await this.alertCtrl.create({
      header: 'Limpar Notificações',
      message: 'Deseja apagar todas as notificações?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Limpar', role: 'destructive',
          handler: async () => {
            this.notificacoes = [];
            const t = await this.toastCtrl.create({
              message: 'Notificações limpas!',
              duration: 2000, color: 'warning', position: 'top'
            });
            await t.present();
          }
        }
      ]
    });
    await alert.present();
  }

  formatarData(data: Date): string {
    const diff = new Date().getTime() - new Date(data).getTime();
    const min = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (min < 1) return 'Agora mesmo';
    if (min < 60) return `${min} min atrás`;
    if (h < 24) return `${h}h atrás`;
    if (d === 1) return 'Ontem';
    return `${d} dias atrás`;
  }

  corTipo(tipo: string) {
    if (tipo === 'preco') return '#d4edda';
    if (tipo === 'promocao') return '#fff3cd';
    if (tipo === 'alerta') return '#e3f2fd';
    return '#f5f5f5';
  }
}
