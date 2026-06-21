import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PrivacidadePage } from './privacidade.page';

describe('PrivacidadePage', () => {
  let component: PrivacidadePage;
  let fixture: ComponentFixture<PrivacidadePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacidadePage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacidadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
