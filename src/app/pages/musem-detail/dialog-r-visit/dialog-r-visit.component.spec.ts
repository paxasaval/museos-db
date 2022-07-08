import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRVisitComponent } from './dialog-r-visit.component';

describe('DialogRVisitComponent', () => {
  let component: DialogRVisitComponent;
  let fixture: ComponentFixture<DialogRVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRVisitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
