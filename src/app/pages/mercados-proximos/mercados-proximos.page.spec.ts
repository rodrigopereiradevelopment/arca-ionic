import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MercadosProximosPage } from './mercados-proximos.page';
import { MercadoService } from '../../services/mercado.service';
import { AvaliacaoService } from '../../services/avaliacao.service';
import { HistoricoService } from '../../services/historico.service';

describe('MercadosProximosPage', () => {
  let component: MercadosProximosPage;
  let fixture: ComponentFixture<MercadosProximosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MercadosProximosPage],
      providers: [
        provideRouter([]),
        { provide: MercadoService, useValue: {} },
        { provide: AvaliacaoService, useValue: {} },
        { provide: HistoricoService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MercadosProximosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
