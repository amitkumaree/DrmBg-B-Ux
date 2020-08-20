import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterConfigComponent } from './master-config.component';

describe('MasterConfigComponent', () => {
  let component: MasterConfigComponent;
  let fixture: ComponentFixture<MasterConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
