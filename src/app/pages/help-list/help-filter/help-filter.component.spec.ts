import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpFilterComponent } from './help-filter.component';

describe('HelpFilterComponent', () => {
  let component: HelpFilterComponent;
  let fixture: ComponentFixture<HelpFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
