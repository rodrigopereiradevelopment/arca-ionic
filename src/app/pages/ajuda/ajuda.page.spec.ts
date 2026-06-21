import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AjudaPage } from './ajuda.page';

describe('AjudaPage', () => {
  let component: AjudaPage;
  let fixture: ComponentFixture<AjudaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjudaPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AjudaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
