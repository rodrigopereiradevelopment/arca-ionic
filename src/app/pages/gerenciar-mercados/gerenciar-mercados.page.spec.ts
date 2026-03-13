import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciarMercadosPage } from './gerenciar-mercados.page';

describe('GerenciarMercadosPage', () => {
  let component: GerenciarMercadosPage;
  let fixture: ComponentFixture<GerenciarMercadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciarMercadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
