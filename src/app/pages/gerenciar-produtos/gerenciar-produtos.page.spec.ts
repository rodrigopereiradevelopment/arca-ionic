import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GerenciarProdutosPage } from './gerenciar-produtos.page';
import { ProdutoService } from '../../services/produto.service';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';

describe('GerenciarProdutosPage', () => {
  let component: GerenciarProdutosPage;
  let fixture: ComponentFixture<GerenciarProdutosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarProdutosPage],
      providers: [
        provideRouter([]),
        { provide: ProdutoService, useValue: {} },
        { provide: CategoriaService, useValue: {} },
        { provide: AuthService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarProdutosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
