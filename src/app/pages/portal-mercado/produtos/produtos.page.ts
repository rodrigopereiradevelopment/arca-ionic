import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../../../services/auth.service';
import { PortalMercadoService, ProdutoPreco } from '../../../services/portal-mercado.service';

@Component({
  selector: 'app-portal-produtos',
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IonContent],
})
export class PortalProdutosPage {
  private auth = inject(AuthService);
  private portalSvc = inject(PortalMercadoService);
  private toastCtrl = inject(ToastController);

  produtos: ProdutoPreco[] = [];
  carregando = true;
  busca = '';
  pagina = 1;

  editando: { [precoId: number]: { preco: string; promocao: boolean; descricao: string } } = {};

  async ionViewWillEnter() {
    await this.carregar();
  }

  async carregar() {
    this.carregando = true;
    const token = this.auth.usuario?.token;
    if (!token) return;
    const data = await this.portalSvc.listarProdutos(token, this.pagina, this.busca);
    if (data) this.produtos = data.produtos;
    this.carregando = false;
  }

  async buscar() {
    this.pagina = 1;
    await this.carregar();
  }

  iniciarEdicao(p: ProdutoPreco) {
    this.editando[p.precoId] = {
      preco: String(p.preco),
      promocao: p.promocao,
      descricao: p.descricaoPromocao || '',
    };
  }

  cancelarEdicao(precoId: number) {
    delete this.editando[precoId];
  }

  async salvarEdicao(p: ProdutoPreco) {
    const ed = this.editando[p.precoId];
    if (!ed) return;

    const valor = parseFloat(ed.preco);
    if (isNaN(valor) || valor <= 0) {
      const t = await this.toastCtrl.create({ message: 'Preço inválido', duration: 2000, color: 'warning' });
      await t.present();
      return;
    }

    const token = this.auth.usuario?.token;
    if (!token) return;

    const ok = await this.portalSvc.atualizarPreco(token, p.produtoId, valor, ed.promocao, ed.descricao);
    if (ok) {
      p.preco = valor;
      p.promocao = ed.promocao;
      p.descricaoPromocao = ed.descricao;
      delete this.editando[p.precoId];
      const t = await this.toastCtrl.create({ message: 'Preço atualizado ✅', duration: 2000, color: 'success' });
      await t.present();
    } else {
      const t = await this.toastCtrl.create({ message: 'Erro ao atualizar', duration: 2000, color: 'danger' });
      await t.present();
    }
  }
}
