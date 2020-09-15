import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccOpeningComponent } from './acc-opening.component';

describe('AccOpeningComponent', () => {
  let component: AccOpeningComponent;
  let fixture: ComponentFixture<AccOpeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccOpeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccOpeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
