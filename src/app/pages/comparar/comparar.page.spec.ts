import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompararPage } from './comparar.page';

describe('CompararPage', () => {
  let component: CompararPage;
  let fixture: ComponentFixture<CompararPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CompararPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
