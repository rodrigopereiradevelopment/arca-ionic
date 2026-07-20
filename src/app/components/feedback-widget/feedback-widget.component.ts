import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubbleEllipses, close } from 'ionicons/icons';
import { HistoricoService } from '../../services/historico.service';

@Component({
  selector: 'app-feedback-widget',
  templateUrl: './feedback-widget.component.html',
  styleUrls: ['./feedback-widget.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon]
})
export class FeedbackWidgetComponent {
  private historicoService = inject(HistoricoService);

  isOpen = false;
  emojiSelecionado: string | null = null;
  mensagem = '';
  enviado = false;

  emojis = [
    { valor: 'ruim', icone: '😞', label: 'Ruim' },
    { valor: 'ok', icone: '😐', label: 'Ok' },
    { valor: 'bom', icone: '😊', label: 'Bom' },
    { valor: 'otimo', icone: '🤩', label: 'Ótimo' },
  ];

  constructor() {
    addIcons({ chatbubbleEllipses, close });
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  selecionar(emoji: string) {
    this.emojiSelecionado = emoji;
  }

  async enviar() {
    if (!this.emojiSelecionado) return;

    await this.historicoService.adicionar({
      tipo: 'pesquisa',
      descricao: `Feedback: ${this.emojiSelecionado}`,
      detalhe: this.mensagem || 'Sem mensagem',
      icone: this.emojis.find(e => e.valor === this.emojiSelecionado)?.icone || '💬',
    });

    this.enviado = true;
    setTimeout(() => {
      this.isOpen = false;
      this.enviado = false;
      this.emojiSelecionado = null;
      this.mensagem = '';
    }, 1500);
  }

  fechar() {
    this.isOpen = false;
    this.emojiSelecionado = null;
    this.mensagem = '';
    this.enviado = false;
  }
}
