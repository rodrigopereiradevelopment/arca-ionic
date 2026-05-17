import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

const mercadosMaisBaratos = [
  { id: 1, nome: "Imperial", lat: -22.4383822, lng: -46.9327464, preco: "R$ --" },
  { id: 2, nome: "Ponto Novo", lat: -22.4313656, lng: -46.9527085, preco: "R$ --" },
  { id: 3, nome: "GoodBom", lat: -22.4006202, lng: -46.9700459, preco: "R$ --" },
  { id: 4, nome: "Atacadao", lat: -22.4022876, lng: -46.9727049, preco: "R$ --" },
  { id: 5, nome: "Pague Menos", lat: -22.3522237, lng: -46.9464079, preco: "R$ --" },
  { id: 6, nome: "Sao Vicente", lat: -22.4269813, lng: -46.9552736, preco: "R$ --" }
];

@Component({
  selector: 'app-mapa-rotas',
  templateUrl: './mapa-rotas.page.html',
  styleUrls: ['./mapa-rotas.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent]
})
export class MapaRotasPage implements OnInit, AfterViewInit {

  map: any;
  routingControl: any = null;
  listaVisivel = false;
  mercados = mercadosMaisBaratos;
  origemUsuario: any = null;

  constructor() {}
  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => this.iniciarMapa(), 300);
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
