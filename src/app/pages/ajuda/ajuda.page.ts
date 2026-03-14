import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonAccordion, IonAccordionGroup,
  IonItem, IonLabel
} from '@ionic/angular/standalone';
import { environment } from '../../../environments/environment';

interface Mensagem {
  autor: 'usuario' | 'ia';
  texto: string;
  data: Date;
}

@Component({
  selector: 'app-ajuda',
  templateUrl: './ajuda.page.html',
  styleUrls: ['./ajuda.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonContent, IonAccordion, IonAccordionGroup,
    IonItem, IonLabel
  ]
})
export class AjudaPage implements OnInit {

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  abaAtiva: 'chat' | 'faq' | 'guia' | 'sobre' = 'chat';
  mensagem = '';
  carregando = false;

  mensagens: Mensagem[] = [
    {
      autor: 'ia',
      texto: 'Olá! Sou o assistente ARCA 🛒 Posso te ajudar com dúvidas sobre o app, como pesquisar produtos, comparar preços ou traçar rotas. Como posso te ajudar?',
      data: new Date()
    }
  ];

  faqs = [
    {
      pergunta: 'Como funciona o ARCA?',
      resposta: 'O ARCA compara os preços dos produtos em diferentes supermercados de Mogi Mirim. Basta pesquisar um produto ou montar sua lista de compras para ver onde está mais barato!'
    },
    {
      pergunta: 'Como os preços são atualizados?',
      resposta: 'Os preços são atualizados pelos próprios supermercados cadastrados no sistema e também por usuários que reportam preços ao visitar as lojas.'
    },
    {
      pergunta: 'Como adicionar produtos à lista?',
      resposta: 'Pesquise o produto na aba "Pesquisar Produtos" e clique no botão ＋ ao lado do produto. Ele será adicionado automaticamente ao seu carrinho.'
    },
    {
      pergunta: 'Como comparar preços da lista?',
      resposta: 'Com produtos no carrinho, abra o modal clicando no ícone do carrinho no rodapé e clique em "Comparar Preços". O app mostrará qual mercado tem o menor total.'
    },
    {
      pergunta: 'Como traçar rota para o mercado?',
      resposta: 'Na página "Mercados Próximos" ou após comparar preços, clique em "Ver Rotas". O mapa mostrará a rota do seu local até o mercado escolhido.'
    },
    {
      pergunta: 'Como criar um alerta de preço?',
      resposta: 'Pesquise o produto, expanda os preços clicando em ▼ e clique em "Criar Alerta de Preço". Você será notificado quando o preço atingir o valor desejado.'
    },
    {
      pergunta: 'Como reportar um preço errado?',
      resposta: 'Acesse a página de Tickets pelo ícone 🎫 no rodapé e abra um novo ticket do tipo "Preço Incorreto". Você pode anexar uma foto da etiqueta como evidência.'
    },
    {
      pergunta: 'O app funciona offline?',
      resposta: 'Algumas funções básicas funcionam offline, mas para comparar preços e ver o mapa é necessário conexão com a internet.'
    }
  ];

  passos = [
    { icone: '🔍', titulo: 'Pesquise', desc: 'Busque produtos por nome ou código de barras' },
    { icone: '💰', titulo: 'Compare', desc: 'Veja os preços em cada supermercado' },
    { icone: '🛒', titulo: 'Monte a lista', desc: 'Adicione produtos ao carrinho' },
    { icone: '🏆', titulo: 'Escolha', desc: 'Veja qual mercado tem o menor total' },
    { icone: '🗺️', titulo: 'Vá às compras', desc: 'Trace a rota até o mercado' }
  ];

  constructor() {}
  ngOnInit() {}

  async enviarMensagem() {
    if (!this.mensagem.trim() || this.carregando) return;

    const textoUsuario = this.mensagem.trim();
    this.mensagem = '';

    this.mensagens.push({
      autor: 'usuario',
      texto: textoUsuario,
      data: new Date()
    });

    this.carregando = true;
    this.scrollChat();

    try {
      const resposta = await this.chamarGemini(textoUsuario);
      this.mensagens.push({
        autor: 'ia',
        texto: resposta,
        data: new Date()
      });
    } catch (e) {
      this.mensagens.push({
        autor: 'ia',
        texto: 'Desculpe, tive um problema ao responder. Tente novamente ou abra um ticket! 🎫',
        data: new Date()
      });
    }

    this.carregando = false;
    this.scrollChat();
  }

  async chamarGemini(pergunta: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${environment.geminiKey}`;

    const body = {
      contents: [{
        parts: [{
          text: `Você é o assistente virtual do app ARCA, um aplicativo de comparação de preços de supermercados em Mogi Mirim, São Paulo, Brasil. 
          
Responda sempre em português brasileiro de forma amigável, clara e objetiva. 
Foque em ajudar com dúvidas sobre o app: pesquisar produtos, comparar preços, montar lista de compras, traçar rotas para mercados, criar alertas de preço, abrir tickets de suporte.
Se a pergunta não for relacionada ao app, redirecione gentilmente para temas do ARCA.
Mantenha respostas curtas (máximo 3 parágrafos).

Pergunta do usuário: ${pergunta}`
        }]
      }]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log('Gemini response:', JSON.stringify(data));
    return data.candidates[0].content.parts[0].text;
  }

  scrollChat() {
    setTimeout(() => {
      if (this.chatContainer) {
        const el = this.chatContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
  }
}
