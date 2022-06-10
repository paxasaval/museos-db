import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusemDetailComponent } from './musem-detail.component';

describe('MusemDetailComponent', () => {
  let component: MusemDetailComponent;
  let fixture: ComponentFixture<MusemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusemDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MusemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
