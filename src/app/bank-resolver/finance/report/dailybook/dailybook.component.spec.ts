import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailybookComponent } from './dailybook.component';

describe('DailybookComponent', () => {
  let component: DailybookComponent;
  let fixture: ComponentFixture<DailybookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailybookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailybookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
