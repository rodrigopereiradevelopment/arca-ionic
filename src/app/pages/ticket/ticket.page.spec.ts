import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TicketPage } from './ticket.page';
import { TicketService } from '../../services/ticket.service';

describe('TicketPage', () => {
  let component: TicketPage;
  let fixture: ComponentFixture<TicketPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketPage],
      providers: [provideRouter([]), { provide: TicketService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
