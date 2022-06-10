import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPointComponent } from './info-point.component';

describe('InfoPointComponent', () => {
  let component: InfoPointComponent;
  let fixture: ComponentFixture<InfoPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
