import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { MERCADOS_MAP, MERCADOS_COORDS } from '../../constants/mercados';
import { CarrinhoService } from '../../services/carrinho.service';
import { environment } from '../../../environments/environment';

interface MercadoMapa {
  id: number;
  nome: string;
  lat: number;
  lng: number;
  preco: string;
  precoNum: number;
}

@Component({
  selector: 'app-mapa-rotas',
  templateUrl: './mapa-rotas.page.html',
  styleUrls: ['./mapa-rotas.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent]
})
export class MapaRotasPage implements OnInit, AfterViewInit {
  private carrinhoService = inject(CarrinhoService);

  map: any;
  routingControl: any = null;
  listaVisivel = false;
  origemUsuario: any = null;
  carregando = false;

  mercados: MercadoMapa[];

  constructor() {
    this.mercados = Object.entries(MERCADOS_COORDS).map(([id, coords]) => ({
      id: Number(id),
      nome: MERCADOS_MAP[Number(id)]?.nome ?? 'Mercado',
      lat: coords.lat,
      lng: coords.lng,
      preco: 'R$ --',
      precoNum: 0,
    }));
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.carregarPrecos();
    setTimeout(() => this.iniciarMapa(), 300);
  }

  private async carregarPrecos() {
    const itens = this.carrinhoService.lista;
    if (itens.length === 0) return;

    this.carregando = true;
    try {
      const payload = itens.map(i => ({ id: i.id, nome: i.nome, quantidade: i.quantidade || 1 }));
      const res = await fetch(`${environment.apiUrl}/api/comparar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtos: payload }),
      });
      const data = await res.json();
      if (data.sucesso && data.mercados) {
        const precoPorId: Record<number, number> = {};
        data.mercados.forEach((m: any) => { precoPorId[m.id] = m.total; });

        this.mercados.forEach(m => {
          const total = precoPorId[m.id];
          if (total && total > 0) {
            m.precoNum = total;
            m.preco = `R$ ${total.toFixed(2)}`;
          }
        });
        this.mercados.sort((a, b) => a.precoNum - b.precoNum);
      }
    } catch {
      /* fallback — R$ -- */
    } finally {
      this.carregando = false;
    }
  }

  iniciarMapa() {
    this.map = L.map('mapa').setView([-22.4333, -46.9583], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(this.map);
    this.map.locate({ setView: false, maxZoom: 16, enableHighAccuracy: true });
    this.map.on('locationfound', (e: any) => this.onLocationFound(e));
    this.map.on('locationerror', (e: any) => this.onLocationError(e));
  }

  onLocationFound(e: any) {
    this.origemUsuario = e.latlng;
    this.map.setView(e.latlng, 15);
    L.marker(e.latlng).addTo(this.map).bindPopup("Sua Localização").openPopup();
    this.adicionarMarcadores(e.latlng);
  }

  onLocationError(e: any) {
    console.warn("Falha na geolocalização:", e.message);
    const padrao = L.latLng(-22.4400, -46.9650);
    this.origemUsuario = padrao;
    L.marker(padrao).addTo(this.map).bindPopup("Partida Padrão (Mogi Mirim)").openPopup();
    this.adicionarMarcadores(padrao);
  }

  adicionarMarcadores(origem: any) {
    const marketIcon = L.icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    this.mercados.forEach(mercado => {
      const destino = L.latLng(mercado.lat, mercado.lng);
      L.marker(destino, { icon: marketIcon })
        .addTo(this.map)
        .bindPopup(`<b>${mercado.nome}</b><br>${mercado.preco}`)
        .on('click', () => this.tracarRota(origem, destino));
    });

    if (this.mercados.length > 0 && this.mercados[0].precoNum > 0) {
      const melhor = this.mercados[0];
      const destino = L.latLng(melhor.lat, melhor.lng);
      setTimeout(() => this.tracarRota(origem, destino), 500);
    }
  }

  tracarRota(origem: any, destino: any) {
    const org = origem || this.origemUsuario;
    if (!org) return;

    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }

    const dest = L.latLng(destino.lat, destino.lng);

    this.routingControl = (L as any).Routing.control({
      waypoints: [org, dest],
      routeWhileDragging: false,
      showAlternatives: false,
      collapsed: false
    }).addTo(this.map);

    this.listaVisivel = false;
  }

  toggleLista() {
    this.listaVisivel = !this.listaVisivel;
  }
}
