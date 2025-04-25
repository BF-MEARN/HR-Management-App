import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaAllComponent } from './visa-all.component';

describe('VisaAllComponent', () => {
  let component: VisaAllComponent;
  let fixture: ComponentFixture<VisaAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisaAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisaAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
