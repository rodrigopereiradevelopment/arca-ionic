import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

const MERCADOS = [
  { id: 1, nome: 'Big Bom', lat: -22.4250, lng: -46.9400, distancia: 0.8,
    horario: '07:00 - 22:00', telefone: '(19) 3862-0001', logo: 'assets/img/BigBom-Icon.png' },
  { id: 2, nome: 'Supermercado SMC', lat: -22.4350, lng: -46.9550, distancia: 1.4,
    horario: '08:00 - 21:00', telefone: '(19) 3862-0002', logo: 'assets/img/SMC.png' },
  { id: 3, nome: 'Supermercado SPN', lat: -22.4450, lng: -46.9700, distancia: 2.1,
    horario: '07:30 - 22:30', telefone: '(19) 3862-0003', logo: 'assets/img/spn.png' }
];

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
  mercados = MERCADOS;

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

  constructor() {}
  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => this.iniciarMapa(), 300);
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
    this.adicionarMarcadores();
  }

  onLocationError(e: any) {
    const padrao = L.latLng(-22.4400, -46.9650);
    this.origemUsuario = padrao;
    L.marker(padrao, { icon: this.iconeAzul() })
      .addTo(this.map).bindPopup('📍 Localização padrão').openPopup();
    this.adicionarMarcadores();
  }

  adicionarMarcadores() {
    this.mercados.forEach(mercado => {
      const cor = mercado.distancia <= 1 ? 'green' :
                  mercado.distancia <= 2 ? 'gold' : 'red';
      const icon = L.icon({
        iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${cor}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
      });
      L.marker([mercado.lat, mercado.lng], { icon })
        .addTo(this.map)
        .bindPopup(`<b>${mercado.nome}</b><br>📏 ${mercado.distancia} km<br>🕐 ${mercado.horario}`)
        .on('click', () => {
          this.mercadoSelecionado = mercado;
          this.listaVisivel = true;
        });
    });
  }

  centralizarMercado(mercado: any) {
    this.map.setView([mercado.lat, mercado.lng], 16);
    this.mercadoSelecionado = mercado;
  }

  toggleLista() {
    this.listaVisivel = !this.listaVisivel;
  }
}
