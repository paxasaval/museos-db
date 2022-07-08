import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPointCardComponent } from './info-point-card.component';

describe('InfoPointCardComponent', () => {
  let component: InfoPointCardComponent;
  let fixture: ComponentFixture<InfoPointCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPointCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPointCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
