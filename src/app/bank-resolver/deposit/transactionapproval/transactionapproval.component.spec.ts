import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionapprovalComponent } from './transactionapproval.component';

describe('TransactionapprovalComponent', () => {
  let component: TransactionapprovalComponent;
  let fixture: ComponentFixture<TransactionapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
