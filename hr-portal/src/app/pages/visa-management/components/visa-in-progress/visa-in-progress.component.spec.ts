import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaInProgressComponent } from './visa-in-progress.component';

describe('VisaInProgressComponent', () => {
  let component: VisaInProgressComponent;
  let fixture: ComponentFixture<VisaInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisaInProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisaInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
