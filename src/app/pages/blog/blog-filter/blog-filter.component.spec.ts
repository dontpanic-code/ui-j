import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogFilterComponent } from './blog-filter.component';

describe('BlogFilterComponent', () => {
  let component: BlogFilterComponent;
  let fixture: ComponentFixture<BlogFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
