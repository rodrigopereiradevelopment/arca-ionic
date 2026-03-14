import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PesquisarProdutosPage } from './pesquisar-produtos.page';

describe('PesquisarProdutosPage', () => {
  let component: PesquisarProdutosPage;
  let fixture: ComponentFixture<PesquisarProdutosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PesquisarProdutosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
