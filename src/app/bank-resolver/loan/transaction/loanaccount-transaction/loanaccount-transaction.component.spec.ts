import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanaccountTransactionComponent } from './loanaccount-transaction.component';

describe('LoanaccountTransactionComponent', () => {
  let component: LoanaccountTransactionComponent;
  let fixture: ComponentFixture<LoanaccountTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanaccountTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanaccountTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
