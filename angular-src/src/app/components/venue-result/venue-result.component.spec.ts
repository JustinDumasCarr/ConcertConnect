import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueResultComponent } from './venue-result.component';

describe('VenueResultComponent', () => {
  let component: VenueResultComponent;
  let fixture: ComponentFixture<VenueResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
