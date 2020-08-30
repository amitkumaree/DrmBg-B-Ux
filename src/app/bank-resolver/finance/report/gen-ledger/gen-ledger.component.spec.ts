import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenLedgerComponent } from './gen-ledger.component';

describe('GenLedgerComponent', () => {
  let component: GenLedgerComponent;
  let fixture: ComponentFixture<GenLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
