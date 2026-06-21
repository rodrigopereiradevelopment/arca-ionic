import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TermosPage } from './termos.page';

describe('TermosPage', () => {
  let component: TermosPage;
  let fixture: ComponentFixture<TermosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermosPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TermosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
