import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingApplicationsComponent } from './onboarding-applications.component';

describe('OnboardingApplicationsComponent', () => {
  let component: OnboardingApplicationsComponent;
  let fixture: ComponentFixture<OnboardingApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
