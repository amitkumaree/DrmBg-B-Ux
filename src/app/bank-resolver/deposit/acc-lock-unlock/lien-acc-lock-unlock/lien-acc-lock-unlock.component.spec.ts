import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LienAccLockUnlockComponent } from './lien-acc-lock-unlock.component';

describe('LienAccLockUnlockComponent', () => {
  let component: LienAccLockUnlockComponent;
  let fixture: ComponentFixture<LienAccLockUnlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LienAccLockUnlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LienAccLockUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
