import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwRenewalViewComponent } from './dw-renewal-view.component';

describe('DwRenewalViewComponent', () => {
  let component: DwRenewalViewComponent;
  let fixture: ComponentFixture<DwRenewalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwRenewalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwRenewalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
