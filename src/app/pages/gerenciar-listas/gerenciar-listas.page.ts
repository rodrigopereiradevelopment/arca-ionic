import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonButton, IonIcon, IonList, IonItem, IonItemSliding, IonItemOptions,
  IonItemOption, IonLabel, IonSpinner, IonRefresher, IonRefresherContent,
  AlertController, ToastController, ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, list, create, copy, trash, arrowBack } from 'ionicons/icons';
import { ListaService, ListaComparacao } from '../../services/lista.service';
import { ComparacaoService } from '../../services/comparacao.service';

@Component({
  selector: 'app-gerenciar-listas',
  templateUrl: './gerenciar-listas.page.html',
  styleUrls: ['./gerenciar-listas.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonBackButton, IonButton, IonIcon, IonList, IonItem, IonItemSliding,
    IonItemOptions, IonItemOption, IonLabel, IonSpinner, IonRefresher,
    IonRefresherContent
  ]
})
export class GerenciarListasPage {
  private listaService = inject(ListaService);
  private comparacaoService = inject(ComparacaoService);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);
  private actionSheetCtrl = inject(ActionSheetController);

  listas: ListaComparacao[] = [];
  loading = true;

  constructor() {
    addIcons({ add, list, create, copy, trash, arrowBack });
  }

  async ionViewWillEnter() {
    await this.carregar();
  }

  async carregar(event?: any) {
    this.loading = !event;
    this.listas = await this.listaService.listar();
    this.loading = false;
    if (event) event.target.complete();
  }

  async criarLista() {
    const alert = await this.alertCtrl.create({
      header: 'Nova lista',
      inputs: [{ name: 'nome', type: 'text', placeholder: 'Ex: Compra do mês' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Criar',
          handler: async (data) => {
            if (!data.nome?.trim()) return;
            const lista = await this.listaService.criar(data.nome.trim(), []);
            if (lista) {
              this.listas.unshift(lista);
              this.mostrarToast('Lista criada!', 'success');
              this.editarLista(lista);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editarNome(lista: ListaComparacao) {
    const alert = await this.alertCtrl.create({
      header: 'Renomear lista',
      inputs: [{ name: 'nome', type: 'text', value: lista.nome }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: async (data) => {
            if (!data.nome?.trim()) return;
            const atualizada = await this.listaService.atualizar(lista.id, { nome: data.nome.trim() });
            if (atualizada) {
              lista.nome = atualizada.nome;
              this.mostrarToast('Lista renomeada', 'success');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async excluir(lista: ListaComparacao) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir lista',
      message: `Excluir "${lista.nome}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: async () => {
            const ok = await this.listaService.excluir(lista.id);
            if (ok) {
              this.listas = this.listas.filter(l => l.id !== lista.id);
              this.mostrarToast('Lista excluída', 'success');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async duplicar(lista: ListaComparacao) {
    const duplicada = await this.listaService.duplicar(lista);
    if (duplicada) {
      this.listas.unshift(duplicada);
      this.mostrarToast('Lista duplicada', 'success');
    }
  }

  editarLista(lista: ListaComparacao) {
    this.router.navigate(['/editar-lista', lista.id]);
  }

  abrirLista(lista: ListaComparacao) {
    this.router.navigate(['/editar-lista', lista.id]);
  }

  compararLista(lista: ListaComparacao) {
    this.comparacaoService.limpar();
    lista.itens.forEach(item => {
      this.comparacaoService.adicionar({
        id: item.id, nome: item.nome, img: item.img,
        quantidade: item.quantidade
      });
    });
    this.router.navigate(['/comparar']);
  }

  private async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color, position: 'top' });
    await t.present();
  }
}
