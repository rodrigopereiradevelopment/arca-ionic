import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../../../services/auth.service';
import { PortalMercadoService } from '../../../services/portal-mercado.service';

@Component({
  selector: 'app-portal-importar',
  templateUrl: './importar.page.html',
  styleUrls: ['./importar.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IonContent],
})
export class PortalImportarPage {
  private auth = inject(AuthService);
  private portalSvc = inject(PortalMercadoService);
  private toastCtrl = inject(ToastController);

  csvTexto = 'nome;preco;ean;promocao;descricao_promocao';
  enviando = false;
  resultado: { importados: number; erros: number; resultados: any[]; errosDetalhe: any[] } | null = null;

  async importar() {
    const linhas = this.csvTexto
      .split('\n')
      .map((linha, idx) => {
        if (idx === 0) return null;
        const cols = linha.split(';').map(c => c.trim());
        if (cols.length < 2) return null;
        return {
          nome: cols[0] || '',
          preco: cols[1] || '',
          ean: cols[2] || '',
          promocao: cols[3] || '',
          descricao_promocao: cols[4] || '',
        };
      })
      .filter(Boolean) as Array<{ nome: string; preco: string; ean: string; promocao: string; descricao_promocao: string }>;

    if (linhas.length === 0) {
      const t = await this.toastCtrl.create({ message: 'Nenhuma linha para importar', duration: 2000, color: 'warning' });
      await t.present();
      return;
    }

    const token = this.auth.usuario?.token;
    if (!token) return;

    this.enviando = true;
    this.resultado = await this.portalSvc.importarCSV(token, linhas);
    this.enviando = false;

    if (!this.resultado) {
      const t = await this.toastCtrl.create({ message: 'Erro ao importar', duration: 3000, color: 'danger' });
      await t.present();
    }
  }
}
