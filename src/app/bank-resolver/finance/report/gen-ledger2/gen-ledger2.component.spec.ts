import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenLedger2Component } from './gen-ledger2.component';

describe('GenLedger2Component', () => {
  let component: GenLedger2Component;
  let fixture: ComponentFixture<GenLedger2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenLedger2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenLedger2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
