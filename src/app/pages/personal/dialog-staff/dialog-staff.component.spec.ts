import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStaffComponent } from './dialog-staff.component';

describe('DialogStaffComponent', () => {
  let component: DialogStaffComponent;
  let fixture: ComponentFixture<DialogStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
