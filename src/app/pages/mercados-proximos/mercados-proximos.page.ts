import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { MercadoService, Mercado } from '../../services/mercado.service';
import { AvaliacaoService } from '../../services/avaliacao.service';
import { HistoricoService } from '../../services/historico.service';
import { MERCADOS_MAP } from '../../constants/mercados';

function calcDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

@Component({
  selector: 'app-mercados-proximos',
  templateUrl: './mercados-proximos.page.html',
  styleUrls: ['./mercados-proximos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent]
})
export class MercadosProximosPage implements AfterViewInit {
  private mercadoSvc = inject(MercadoService);
  avaliacaoSvc = inject(AvaliacaoService);
  private historicoService = inject(HistoricoService);
  private toastCtrl = inject(ToastController);

  map: any;
  routingControl: any = null;
  listaVisivel = true;
  filtroDistancia = 10;
  ordenacao: 'distancia' | 'nome' | 'nota' = 'distancia';
  mercadoSelecionado: any = null;
  origemUsuario: any = null;
  mercados: (Mercado & { distancia: number; horario: string; logo: string; media_geral?: number; total_avaliacoes?: number })[] = [];
  carregando = true;
  rotaAtiva = false;
  destinoRota: any = null;

  modalAvaliacao = false;
  avaliandoMercado: any = null;
  formAvaliacao = { nota_geral: 5, nota_atendimento: 5, nota_qualidade: 5, nota_preco: 5, comentario: '' };
  enviandoAvaliacao = false;
  avaliacaoEnviada = false;

  get mercadosFiltrados() {
    return this.mercados
      .filter(m => m.distancia <= this.filtroDistancia)
      .sort((a, b) => {
        if (this.ordenacao === 'distancia') return a.distancia - b.distancia;
        if (this.ordenacao === 'nota') return (b.media_geral || 0) - (a.media_geral || 0);
        return a.nome.localeCompare(b.nome);
      });
  }

  corDistancia(dist: number) {
    if (dist <= 1) return '#00BF9F';
    if (dist <= 2) return '#ffc107';
    return '#e74c3c';
  }

  async ngAfterViewInit() {
    await this.carregarMercados();
    setTimeout(() => this.iniciarMapa(), 300);
  }

  async carregarMercados() {
    this.carregando = true;
    const [lista, resumoNotas] = await Promise.all([
      this.mercadoSvc.listar('aprovado'),
      this.avaliacaoSvc.getResumo(),
    ]);
    const mapaNotas = new Map(
      (resumoNotas as any[]).map((r: any) => [r.supermercado_id, r])
    );
    this.mercados = lista.map(m => {
      const nota = mapaNotas.get(m.id);
      return {
        ...m,
        distancia: 0,
        horario: '',
        logo: MERCADOS_MAP[m.id]?.logo || 'assets/img/mercado.png',
        media_geral: nota?.media_geral || 0,
        total_avaliacoes: nota?.total || 0,
      };
    });
    this.carregando = false;
  }

  iniciarMapa() {
    this.map = L.map('mapa-proximos').setView([-22.4333, -46.9583], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 20,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(this.map);
    this.map.locate({ setView: false, maxZoom: 16, enableHighAccuracy: true });
    this.map.on('locationfound', (e: any) => this.onLocationFound(e));
    this.map.on('locationerror', (e: any) => this.onLocationError(e));
  }

  iconeAzul() {
    return L.icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
  }

  onLocationFound(e: any) {
    this.origemUsuario = e.latlng;
    this.map.setView(e.latlng, 14);
    L.marker(e.latlng, { icon: this.iconeAzul() })
      .addTo(this.map).bindPopup('📍 Você está aqui').openPopup();
    this.calcularDistancias();
    this.adicionarMarcadores();
  }

  onLocationError(e: any) {
    const padrao = L.latLng(-22.4400, -46.9650);
    this.origemUsuario = padrao;
    L.marker(padrao, { icon: this.iconeAzul() })
      .addTo(this.map).bindPopup('📍 Localização padrão').openPopup();
    this.calcularDistancias();
    this.adicionarMarcadores();
  }

  calcularDistancias() {
    if (!this.origemUsuario) return;
    this.mercados.forEach(m => {
      if (m.latitude && m.longitude) {
        m.distancia = parseFloat(
          calcDistancia(this.origemUsuario.lat, this.origemUsuario.lng, m.latitude, m.longitude).toFixed(1)
        );
      }
    });
  }

  adicionarMarcadores() {
    this.mercados.forEach(mercado => {
      if (!mercado.latitude || !mercado.longitude) return;
      const cor = mercado.distancia <= 1 ? 'green' :
                  mercado.distancia <= 2 ? 'gold' : 'red';
      const icon = L.icon({
        iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${cor}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
      });
      const estrelas = mercado.media_geral ? this.avaliacaoSvc.estrelas(mercado.media_geral) : '';
      L.marker([mercado.latitude, mercado.longitude], { icon })
        .addTo(this.map)
        .bindPopup(`<b>${mercado.nome}</b><br>📏 ${mercado.distancia} km${estrelas ? '<br>' + estrelas : ''}`)
        .on('click', () => {
          this.mercadoSelecionado = mercado;
          this.listaVisivel = true;
        });
    });
  }

  centralizarMercado(mercado: any) {
    this.map.setView([mercado.latitude, mercado.longitude], 16);
    this.mercadoSelecionado = mercado;
  }

  toggleLista() {
    this.listaVisivel = !this.listaVisivel;
  }

  tracarRota(mercado: any, event: Event) {
    event.stopPropagation();
    const destino = L.latLng(mercado.latitude, mercado.longitude);
    this.destinoRota = destino;

    if (!this.origemUsuario) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const origem = L.latLng(pos.coords.latitude, pos.coords.longitude);
          this.origemUsuario = origem;
          this.executarRota(origem, destino, mercado);
        },
        () => {
          const padrao = L.latLng(-22.4400, -46.9650);
          this.executarRota(padrao, destino, mercado);
        },
        { enableHighAccuracy: true }
      );
      return;
    }

    this.executarRota(this.origemUsuario, destino, mercado);
  }

  private executarRota(origem: any, destino: any, mercado: any) {
    const Routing = (L as any).Routing;
    if (!Routing?.control) {
      this.mostrarToast('Rota indisponível offline.', 'warning');
      return;
    }

    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }

    this.routingControl = Routing.control({
      waypoints: [origem, destino],
      routeWhileDragging: false,
      showAlternatives: false,
      collapsed: false,
    }).addTo(this.map);

    this.rotaAtiva = true;
    this.listaVisivel = false;

    this.routingControl.on('routesfound', (e: any) => {
      const bounds = e.routes[0].coordinates.reduce((b: any, c: any) => {
        return b.extend(c);
      }, L.latLngBounds(origem, destino));
      this.map.fitBounds(bounds, { padding: [50, 50] });
    });

    this.historicoService.adicionar({
      tipo: 'rota',
      descricao: `Rota para ${mercado.nome}`,
      detalhe: `${origem.lat.toFixed(4)}, ${origem.lng.toFixed(4)} → ${destino.lat.toFixed(4)}, ${destino.lng.toFixed(4)}`,
      icone: '🗺️',
      rota: '/mercados-proximos',
    });
  }

  limparRota() {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
    }
    this.rotaAtiva = false;
    this.destinoRota = null;
  }

  abrirAvaliacao(mercado: any, event: Event) {
    event.stopPropagation();
    this.avaliandoMercado = mercado;
    this.formAvaliacao = { nota_geral: 5, nota_atendimento: 5, nota_qualidade: 5, nota_preco: 5, comentario: '' };
    this.avaliacaoEnviada = false;
    this.modalAvaliacao = true;
  }

  definirNota(campo: string, nota: number) {
    (this.formAvaliacao as any)[campo] = nota;
  }

  async enviarAvaliacao() {
    this.enviandoAvaliacao = true;
    const ok = await this.avaliacaoSvc.salvar({
      supermercado_id: this.avaliandoMercado.id,
      ...this.formAvaliacao,
    });
    this.enviandoAvaliacao = false;
    if (ok) {
      this.avaliacaoEnviada = true;
      setTimeout(() => { this.modalAvaliacao = false; this.carregarMercados(); }, 1500);
    }
  }

  fecharModalAvaliacao() {
    this.modalAvaliacao = false;
  }

  private async mostrarToast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 2000, color, position: 'top' });
    await t.present();
  }
}
