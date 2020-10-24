import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwTdInttDtlsViewComponent } from './dw-td-intt-dtls-view.component';

describe('DwTdInttDtlsViewComponent', () => {
  let component: DwTdInttDtlsViewComponent;
  let fixture: ComponentFixture<DwTdInttDtlsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwTdInttDtlsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwTdInttDtlsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
