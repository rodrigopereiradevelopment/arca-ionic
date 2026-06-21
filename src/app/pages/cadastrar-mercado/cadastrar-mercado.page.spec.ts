import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CadastrarMercadoPage } from './cadastrar-mercado.page';
import { MercadoService } from '../../services/mercado.service';
import { AuthService } from '../../services/auth.service';

describe('CadastrarMercadoPage', () => {
  let component: CadastrarMercadoPage;
  let fixture: ComponentFixture<CadastrarMercadoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarMercadoPage],
      providers: [
        provideRouter([]),
        { provide: MercadoService, useValue: {} },
        { provide: AuthService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarMercadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
