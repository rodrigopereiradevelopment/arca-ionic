import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CarrinhoPage } from './carrinho.page';
import { CarrinhoService } from '../../services/carrinho.service';
import { ComparacaoService } from '../../services/comparacao.service';
import { AuthService } from '../../services/auth.service';
import { HistoricoListasService } from '../../services/historico-listas.service';
import { FavoritoService } from '../../services/favorito.service';
import { AudioService } from '../../services/audio.service';

describe('CarrinhoPage', () => {
  let component: CarrinhoPage;
  let fixture: ComponentFixture<CarrinhoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrinhoPage],
      providers: [
        provideRouter([]),
        { provide: CarrinhoService, useValue: {} },
        { provide: ComparacaoService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: HistoricoListasService, useValue: {} },
        { provide: FavoritoService, useValue: {} },
        { provide: AudioService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarrinhoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
