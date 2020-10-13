import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollbookComponent } from './scrollbook.component';

describe('ScrollbookComponent', () => {
  let component: ScrollbookComponent;
  let fixture: ComponentFixture<ScrollbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrollbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
