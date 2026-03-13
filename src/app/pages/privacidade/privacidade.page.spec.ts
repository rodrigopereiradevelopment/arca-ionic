import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacidadePage } from './privacidade.page';

describe('PrivacidadePage', () => {
  let component: PrivacidadePage;
  let fixture: ComponentFixture<PrivacidadePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacidadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
