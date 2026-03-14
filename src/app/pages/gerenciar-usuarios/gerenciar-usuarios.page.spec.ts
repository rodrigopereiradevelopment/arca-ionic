import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciarUsuariosPage } from './gerenciar-usuarios.page';

describe('GerenciarUsuariosPage', () => {
  let component: GerenciarUsuariosPage;
  let fixture: ComponentFixture<GerenciarUsuariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciarUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
