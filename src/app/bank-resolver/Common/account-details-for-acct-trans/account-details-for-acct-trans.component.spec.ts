import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailsForAcctTransComponent } from './account-details-for-acct-trans.component';

describe('AccountDetailsForAcctTransComponent', () => {
  let component: AccountDetailsForAcctTransComponent;
  let fixture: ComponentFixture<AccountDetailsForAcctTransComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountDetailsForAcctTransComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDetailsForAcctTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
