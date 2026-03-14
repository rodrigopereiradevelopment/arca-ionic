import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MercadosProximosPage } from './mercados-proximos.page';

describe('MercadosProximosPage', () => {
  let component: MercadosProximosPage;
  let fixture: ComponentFixture<MercadosProximosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MercadosProximosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
