import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankWiseConfigComponent } from './bank-wise-config.component';

describe('BankWiseConfigComponent', () => {
  let component: BankWiseConfigComponent;
  let fixture: ComponentFixture<BankWiseConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankWiseConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankWiseConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
