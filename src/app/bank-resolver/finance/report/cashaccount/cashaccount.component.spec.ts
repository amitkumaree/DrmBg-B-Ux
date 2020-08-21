import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashaccountComponent } from './cashaccount.component';

describe('CashaccountComponent', () => {
  let component: CashaccountComponent;
  let fixture: ComponentFixture<CashaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
