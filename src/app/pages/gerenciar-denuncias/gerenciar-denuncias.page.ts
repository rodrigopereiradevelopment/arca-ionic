import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { DenunciaService, Denuncia } from '../../services/denuncia.service';

@Component({
  selector: 'app-gerenciar-denuncias',
  templateUrl: './gerenciar-denuncias.page.html',
  styleUrls: ['./gerenciar-denuncias.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent]
})
export class GerenciarDenunciasPage {
  private denunciaSvc = inject(DenunciaService);
  private toastCtrl = inject(ToastController);

  denuncias: Denuncia[] = [];
  carregando = true;
  resolvendo = new Set<number>();

  async ionViewWillEnter() {
    await this.carregar();
  }

  async carregar() {
    this.carregando = true;
    this.denuncias = await this.denunciaSvc.listar();
    this.carregando = false;
  }

  get pendentes() {
    return this.denuncias.filter(d => d.status === 'pendente');
  }

  get resolvidas() {
    return this.denuncias.filter(d => d.status !== 'pendente');
  }

  async resolver(d: Denuncia) {
    this.resolvendo.add(d.id);
    const ok = await this.denunciaSvc.resolver(d.id);
    this.resolvendo.delete(d.id);
    if (ok) {
      d.status = 'resolvido';
      await this.toast('Denúncia resolvida ✅', 'success');
    } else {
      await this.toast('Erro ao resolver', 'danger');
    }
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }
}
