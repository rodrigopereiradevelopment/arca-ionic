import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { PortalMercadoService, DashboardData } from '../../services/portal-mercado.service';

@Component({
  selector: 'app-portal-mercado',
  templateUrl: './portal-mercado.page.html',
  styleUrls: ['./portal-mercado.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent],
})
export class PortalMercadoPage {
  private auth = inject(AuthService);
  private portalSvc = inject(PortalMercadoService);

  dados: DashboardData | null = null;
  carregando = true;
  erro = '';

  async ionViewWillEnter() {
    this.carregando = true;
    this.erro = '';
    const token = this.auth.usuario?.token;
    if (!token) {
      this.erro = 'Faça login primeiro';
      this.carregando = false;
      return;
    }
    this.dados = await this.portalSvc.dashboard(token);
    if (!this.dados) this.erro = 'Erro ao carregar painel. Verifique se você é um mercado_admin.';
    this.carregando = false;
  }
}
