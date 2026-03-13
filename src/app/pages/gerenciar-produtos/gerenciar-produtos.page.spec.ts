import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciarProdutosPage } from './gerenciar-produtos.page';

describe('GerenciarProdutosPage', () => {
  let component: GerenciarProdutosPage;
  let fixture: ComponentFixture<GerenciarProdutosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciarProdutosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
