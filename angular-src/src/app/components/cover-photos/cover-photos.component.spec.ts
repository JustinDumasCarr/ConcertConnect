import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverPhotosComponent } from './cover-photos.component';

describe('CoverPhotosComponent', () => {
  let component: CoverPhotosComponent;
  let fixture: ComponentFixture<CoverPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
