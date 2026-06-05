import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { MercadoService, Mercado } from '../../services/mercado.service';
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
export class MercadosProximosPage implements OnInit, AfterViewInit {

  map: any;
  listaVisivel = true;
  filtroDistancia = 10;
  ordenacao: 'distancia' | 'nome' = 'distancia';
  mercadoSelecionado: any = null;
  origemUsuario: any = null;
  mercados: (Mercado & { distancia: number; horario: string; logo: string })[] = [];
  carregando = true;

  get mercadosFiltrados() {
    return this.mercados
      .filter(m => m.distancia <= this.filtroDistancia)
      .sort((a, b) => this.ordenacao === 'distancia'
        ? a.distancia - b.distancia
        : a.nome.localeCompare(b.nome));
  }

  corDistancia(dist: number) {
    if (dist <= 1) return '#00BF9F';
    if (dist <= 2) return '#ffc107';
    return '#e74c3c';
  }

  constructor(private mercadoSvc: MercadoService) {}
  ngOnInit() {}

  async ngAfterViewInit() {
    await this.carregarMercados();
    setTimeout(() => this.iniciarMapa(), 300);
  }

  async carregarMercados() {
    this.carregando = true;
    const lista = await this.mercadoSvc.listar('aprovado');
    this.mercados = lista.map(m => ({
      ...m,
      distancia: 0,
      horario: '',
      logo: MERCADOS_MAP[m.id]?.logo || 'assets/img/mercado.png'
    }));
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
      L.marker([mercado.latitude, mercado.longitude], { icon })
        .addTo(this.map)
        .bindPopup(`<b>${mercado.nome}</b><br>📏 ${mercado.distancia} km`)
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
}
