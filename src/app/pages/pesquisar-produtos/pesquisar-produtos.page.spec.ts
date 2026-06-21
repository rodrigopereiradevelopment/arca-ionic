import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PesquisarProdutosPage } from './pesquisar-produtos.page';
import { CarrinhoService } from '../../services/carrinho.service';
import { HistoricoService } from '../../services/historico.service';
import { ComparacaoService } from '../../services/comparacao.service';
import { CategoriaService } from '../../services/categoria.service';
import { FavoritoService } from '../../services/favorito.service';
import { DenunciaService } from '../../services/denuncia.service';
import { AudioService } from '../../services/audio.service';
import { AuthService } from '../../services/auth.service';
import { InfoNutricionalService } from '../../services/info-nutricional.service';

describe('PesquisarProdutosPage', () => {
  let component: PesquisarProdutosPage;
  let fixture: ComponentFixture<PesquisarProdutosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesquisarProdutosPage],
      providers: [
        provideRouter([]),
        { provide: CarrinhoService, useValue: {} },
        { provide: HistoricoService, useValue: {} },
        { provide: ComparacaoService, useValue: {} },
        { provide: CategoriaService, useValue: {} },
        { provide: FavoritoService, useValue: {} },
        { provide: DenunciaService, useValue: {} },
        { provide: AudioService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: InfoNutricionalService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PesquisarProdutosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
