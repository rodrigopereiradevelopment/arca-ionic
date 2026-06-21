import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GerenciarUsuariosPage } from './gerenciar-usuarios.page';
import { AuthService } from '../../services/auth.service';

describe('GerenciarUsuariosPage', () => {
  let component: GerenciarUsuariosPage;
  let fixture: ComponentFixture<GerenciarUsuariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarUsuariosPage],
      providers: [provideRouter([]), { provide: AuthService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
