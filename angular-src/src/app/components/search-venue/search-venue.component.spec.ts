import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVenueComponent } from './search-venue.component';

describe('SearchVenueComponent', () => {
  let component: SearchVenueComponent;
  let fixture: ComponentFixture<SearchVenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchVenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
