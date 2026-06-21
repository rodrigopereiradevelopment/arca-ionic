import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CompararPage } from './comparar.page';
import { ComparacaoService } from '../../services/comparacao.service';
import { HistoricoService } from '../../services/historico.service';
import { ListaService } from '../../services/lista.service';

describe('CompararPage', () => {
  let component: CompararPage;
  let fixture: ComponentFixture<CompararPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompararPage],
      providers: [
        provideRouter([]),
        { provide: ComparacaoService, useValue: {} },
        { provide: HistoricoService, useValue: {} },
        { provide: ListaService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompararPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
