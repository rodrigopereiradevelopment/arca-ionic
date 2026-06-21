import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotificacoesPage } from './notificacoes.page';
import { NotificacaoService } from '../../services/notificacao.service';

describe('NotificacoesPage', () => {
  let component: NotificacoesPage;
  let fixture: ComponentFixture<NotificacoesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacoesPage],
      providers: [provideRouter([]), { provide: NotificacaoService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
