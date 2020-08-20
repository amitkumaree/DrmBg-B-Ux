import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankResolverComponent } from './bank-resolver.component';

describe('BankResolverComponent', () => {
  let component: BankResolverComponent;
  let fixture: ComponentFixture<BankResolverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankResolverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
