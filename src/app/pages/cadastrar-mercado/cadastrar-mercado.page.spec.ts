import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastrarMercadoPage } from './cadastrar-mercado.page';

describe('CadastrarMercadoPage', () => {
  let component: CadastrarMercadoPage;
  let fixture: ComponentFixture<CadastrarMercadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastrarMercadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
