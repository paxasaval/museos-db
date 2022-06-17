import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMuseumComponent } from './dialog-museum.component';

describe('DialogMuseumComponent', () => {
  let component: DialogMuseumComponent;
  let fixture: ComponentFixture<DialogMuseumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMuseumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMuseumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
