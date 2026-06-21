import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ModalCarrinhoComponent } from './modal-carrinho.component';
import { CarrinhoService } from '../../services/carrinho.service';
import { ModalController } from '@ionic/angular/standalone';

describe('ModalCarrinhoComponent', () => {
  let component: ModalCarrinhoComponent;
  let fixture: ComponentFixture<ModalCarrinhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCarrinhoComponent],
      providers: [
        provideRouter([]),
        { provide: CarrinhoService, useValue: { lista: [], remover() {}, incrementar() {}, decrementar() {} } },
        { provide: ModalController, useValue: { create: () => Promise.resolve({ present: () => Promise.resolve() }), dismiss: () => Promise.resolve() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCarrinhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
