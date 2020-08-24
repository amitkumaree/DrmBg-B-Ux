import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashcumtrialComponent } from './cashcumtrial.component';

describe('CashcumtrialComponent', () => {
  let component: CashcumtrialComponent;
  let fixture: ComponentFixture<CashcumtrialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashcumtrialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashcumtrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
