import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacoesPage } from './notificacoes.page';

describe('NotificacoesPage', () => {
  let component: NotificacoesPage;
  let fixture: ComponentFixture<NotificacoesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
