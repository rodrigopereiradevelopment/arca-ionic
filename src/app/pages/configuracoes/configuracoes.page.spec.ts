import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfiguracoesPage } from './configuracoes.page';
import { AuthService } from '../../services/auth.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { HistoricoService } from '../../services/historico.service';
import { ConfigService } from '../../services/config.service';
import { PushNotificationService } from '../../services/push-notification.service';

describe('ConfiguracoesPage', () => {
  let component: ConfiguracoesPage;
  let fixture: ComponentFixture<ConfiguracoesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracoesPage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: {} },
        { provide: CarrinhoService, useValue: { lista: [], remover() {} } },
        { provide: HistoricoService, useValue: { lista: [], limpar() {} } },
        { provide: ConfigService, useValue: { config: {
          aparencia: { modoEscuro: false, altoContraste: false },
          acessibilidade: { tamanhoFonte: 'medio', negrito: false, reduzirAnimacoes: false, leitorTela: false, espacamentoLinhas: 'normal' },
          localizacao: { automatica: true, raio: 10 },
          notificacoes: { alertasPreco: true, promocoes: true, email: false, push: true },
          preferencias: { ordenacaoPadrao: 'preco', apenasAprovados: true, som: true, vibrar: true },
          privacidade: { salvarHistorico: true, dadosAnonimos: false },
        }, init() {}, salvar() {}, aplicar() {}, resetar() {} } },
        { provide: PushNotificationService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
