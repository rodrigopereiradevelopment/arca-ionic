import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HistoricoPage } from './historico.page';
import { HistoricoService } from '../../services/historico.service';
import { FavoritoService } from '../../services/favorito.service';

describe('HistoricoPage', () => {
  let component: HistoricoPage;
  let fixture: ComponentFixture<HistoricoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoPage],
      providers: [
        provideRouter([]),
        { provide: HistoricoService, useValue: {} },
        { provide: FavoritoService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
