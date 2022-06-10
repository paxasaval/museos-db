import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPointDetailComponent } from './info-point-detail.component';

describe('InfoPointDetailComponent', () => {
  let component: InfoPointDetailComponent;
  let fixture: ComponentFixture<InfoPointDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPointDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPointDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
