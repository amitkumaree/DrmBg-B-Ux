import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankConfigComponent } from './bank-config.component';

describe('BankConfigComponent', () => {
  let component: BankConfigComponent;
  let fixture: ComponentFixture<BankConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
