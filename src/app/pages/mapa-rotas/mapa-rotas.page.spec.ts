import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaRotasPage } from './mapa-rotas.page';

describe('MapaRotasPage', () => {
  let component: MapaRotasPage;
  let fixture: ComponentFixture<MapaRotasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaRotasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
