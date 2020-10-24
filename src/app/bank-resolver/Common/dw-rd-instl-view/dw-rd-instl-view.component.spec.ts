import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwRdInstlViewComponent } from './dw-rd-instl-view.component';

describe('DwRdInstlViewComponent', () => {
  let component: DwRdInstlViewComponent;
  let fixture: ComponentFixture<DwRdInstlViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwRdInstlViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwRdInstlViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
