import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonButton, IonIcon, IonList, IonListHeader, IonItem, IonItemSliding,
  IonItemOptions, IonItemOption, IonLabel, IonSearchbar, IonSpinner,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, remove, trash, checkmark, create, list, arrowBack } from 'ionicons/icons';
import { ListaService, ItemLista, ListaComparacao } from '../../services/lista.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-editar-lista',
  templateUrl: './editar-lista.page.html',
  styleUrls: ['./editar-lista.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonBackButton, IonButton, IonIcon, IonList, IonListHeader,
    IonItem, IonItemSliding, IonItemOptions, IonItemOption, IonLabel,
    IonSearchbar, IonSpinner
  ]
})
export class EditarListaPage implements OnInit {
  private listaService = inject(ListaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  listaId = 0;
  nomeLista = '';
  itens: ItemLista[] = [];
  busca = '';
  resultadosBusca: any[] = [];
  loading = true;
  alterado = false;

  constructor() {
    addIcons({ add, remove, trash, checkmark, create, list, arrowBack });
  }

  async ngOnInit() {
    this.listaId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.listaId) {
      this.router.navigate(['/gerenciar-listas']);
      return;
    }
    await this.carregarLista();
  }

  async carregarLista() {
    this.loading = true;
    const listas = await this.listaService.listar();
    const lista = listas.find(l => l.id === this.listaId);
    if (lista) {
      this.nomeLista = lista.nome;
      this.itens = lista.itens.map(i => ({ ...i }));
    }
    this.loading = false;
  }

  async buscarProdutos() {
    if (this.busca.length < 2) { this.resultadosBusca = []; return; }
    try {
      const res = await fetch(`${environment.apiUrl}/api/produtos/search?q=${encodeURIComponent(this.busca)}&limit=10`);
      const data = await res.json();
      this.resultadosBusca = (data.data || []).map((p: any) => ({
        id: p.id, nome: p.nome, mercado: ''
      }));
    } catch { this.resultadosBusca = []; }
  }

  adicionarProduto(produto: any) {
    if (this.itens.find(i => i.id === produto.id)) {
      this.mostrarToast('Produto já está na lista', 'warning');
      return;
    }
    this.itens.push({ id: produto.id, nome: produto.nome, quantidade: 1 });
    this.alterado = true;
    this.busca = '';
    this.resultadosBusca = [];
    this.mostrarToast(`${produto.nome} adicionado`, 'success');
  }

  removerItem(index: number) {
    this.itens.splice(index, 1);
    this.alterado = true;
  }

  aumentarQtd(index: number) {
    this.itens[index].quantidade++;
    this.alterado = true;
  }

  diminuirQtd(index: number) {
    if (this.itens[index].quantidade > 1) {
      this.itens[index].quantidade--;
      this.alterado = true;
    }
  }

  async renomear() {
    const alert = await this.alertCtrl.create({
      header: 'Renomear lista',
      inputs: [{ name: 'nome', type: 'text', value: this.nomeLista }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: async (data) => {
            if (!data.nome?.trim()) return;
            const atualizada = await this.listaService.atualizar(this.listaId, { nome: data.nome.trim() });
            if (atualizada) {
              this.nomeLista = atualizada.nome;
              this.mostrarToast('Lista renomeada', 'success');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async excluirLista() {
    const alert = await this.alertCtrl.create({
      header: 'Excluir lista',
      message: `Excluir "${this.nomeLista}" permanentemente?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: async () => {
            const ok = await this.listaService.excluir(this.listaId);
            if (ok) {
              this.mostrarToast('Lista excluída', 'success');
              this.router.navigate(['/gerenciar-listas']);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async salvar() {
    if (!this.alterado) return;
    const atualizada = await this.listaService.atualizar(this.listaId, { itens: this.itens });
    if (atualizada) {
      this.alterado = false;
      this.mostrarToast('Lista salva!', 'success');
      this.router.navigate(['/gerenciar-listas']);
    } else {
      this.mostrarToast('Erro ao salvar', 'danger');
    }
  }

  private async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color, position: 'top' });
    await t.present();
  }
}
