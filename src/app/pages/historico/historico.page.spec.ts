import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoricoPage } from './historico.page';

describe('HistoricoPage', () => {
  let component: HistoricoPage;
  let fixture: ComponentFixture<HistoricoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
