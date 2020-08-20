import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UTCustomerProfileComponent } from './utcustomer-profile.component';

describe('UTCustomerProfileComponent', () => {
  let component: UTCustomerProfileComponent;
  let fixture: ComponentFixture<UTCustomerProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UTCustomerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UTCustomerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
