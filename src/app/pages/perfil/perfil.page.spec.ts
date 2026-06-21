import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PerfilPage } from './perfil.page';
import { AuthService } from '../../services/auth.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { HistoricoService } from '../../services/historico.service';
import { ConfigService } from '../../services/config.service';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilPage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { usuario: null, logado: false, tipo: '' } },
        { provide: CarrinhoService, useValue: { lista: [] } },
        { provide: HistoricoService, useValue: { lista: [], itens$: { subscribe: () => {} } } },
        { provide: ConfigService, useValue: { config: {
          aparencia: { modoEscuro: false, altoContraste: false },
          acessibilidade: { tamanhoFonte: 'medio', negrito: false, reduzirAnimacoes: false, leitorTela: false, espacamentoLinhas: 'normal' },
          localizacao: { automatica: true, raio: 10 },
          notificacoes: { alertasPreco: true, promocoes: true, email: false, push: true },
          preferencias: { ordenacaoPadrao: 'preco', apenasAprovados: true, som: true, vibrar: true },
          privacidade: { salvarHistorico: true, dadosAnonimos: false },
        }, init() {}, salvar() {}, aplicar() {}, resetar() {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
