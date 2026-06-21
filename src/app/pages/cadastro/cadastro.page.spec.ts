import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CadastroPage } from './cadastro.page';
import { AuthService } from '../../services/auth.service';

describe('CadastroPage', () => {
  let component: CadastroPage;
  let fixture: ComponentFixture<CadastroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroPage],
      providers: [provideRouter([]), { provide: AuthService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
