import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuseumCardComponent } from './museum-card.component';

describe('MuseumCardComponent', () => {
  let component: MuseumCardComponent;
  let fixture: ComponentFixture<MuseumCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MuseumCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MuseumCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
