import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBankConfigComponent } from './new-bank-config.component';

describe('NewBankConfigComponent', () => {
  let component: NewBankConfigComponent;
  let fixture: ComponentFixture<NewBankConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBankConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBankConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
