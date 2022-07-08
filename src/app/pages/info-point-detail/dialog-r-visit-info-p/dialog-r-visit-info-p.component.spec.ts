import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRVisitInfoPComponent } from './dialog-r-visit-info-p.component';

describe('DialogRVisitInfoPComponent', () => {
  let component: DialogRVisitInfoPComponent;
  let fixture: ComponentFixture<DialogRVisitInfoPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRVisitInfoPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRVisitInfoPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
