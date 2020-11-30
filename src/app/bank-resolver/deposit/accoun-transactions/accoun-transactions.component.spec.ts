import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccounTransactionsComponent } from './accoun-transactions.component';

describe('AccounTransactionsComponent', () => {
  let component: AccounTransactionsComponent;
  let fixture: ComponentFixture<AccounTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccounTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccounTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
