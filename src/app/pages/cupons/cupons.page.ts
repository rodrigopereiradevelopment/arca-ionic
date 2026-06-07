import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { CupomService, Cupom } from '../../services/cupom.service';

@Component({
  selector: 'app-cupons',
  templateUrl: './cupons.page.html',
  styleUrls: ['./cupons.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent]
})
export class CuponsPage {
  private cupomSvc = inject(CupomService);
  private toastCtrl = inject(ToastController);

  cupons: Cupom[] = [];
  carregando = true;
  usando = false;

  constructor() {
    this.carregar();
  }

  async carregar() {
    this.carregando = true;
    this.cupons = await this.cupomSvc.listar();
    this.carregando = false;
  }

  desconto(c: Cupom): string {
    if (c.tipo === 'percentual') return `${c.percentual_desconto}% OFF`;
    return `R$ ${Number(c.valor_desconto || c.valor).toFixed(2)} OFF`;
  }

  async usarCupom(c: Cupom) {
    this.usando = true;
    const erro = await this.cupomSvc.usar(c.id);
    this.usando = false;
    if (erro) {
      await this.toast(erro, 'danger');
    } else {
      await this.toast('Cupom aplicado! 🎉', 'success');
      this.cupons = this.cupons.filter(x => x.id !== c.id);
    }
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }
}
