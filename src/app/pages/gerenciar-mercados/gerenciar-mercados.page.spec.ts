import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GerenciarMercadosPage } from './gerenciar-mercados.page';
import { MercadoService } from '../../services/mercado.service';
import { AuthService } from '../../services/auth.service';

describe('GerenciarMercadosPage', () => {
  let component: GerenciarMercadosPage;
  let fixture: ComponentFixture<GerenciarMercadosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarMercadosPage],
      providers: [
        provideRouter([]),
        { provide: MercadoService, useValue: {} },
        { provide: AuthService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarMercadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
