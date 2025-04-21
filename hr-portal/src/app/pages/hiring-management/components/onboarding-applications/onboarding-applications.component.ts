import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/interfaces/employee';
import { OnboardingApplicationService } from 'src/app/services/onboarding-application.service';

@Component({
  selector: 'app-onboarding-applications',
  templateUrl: './onboarding-applications.component.html',
  styleUrls: ['./onboarding-applications.component.scss']
})
export class OnboardingApplicationsComponent implements OnInit {
  pending: Employee[] = [];
  approved: Employee[] = [];
  rejected: Employee[] = [];

  constructor(private onboardingService: OnboardingApplicationService) { }

  ngOnInit(): void {
    this.onboardingService.getPending().subscribe((response) => {
      this.pending = response.filter(emp => emp.userId?.role === 'employee');
    });

    this.onboardingService.getApproved().subscribe((response) => {
      this.approved = response.filter(emp => emp.userId?.role === 'employee');
    });

    this.onboardingService.getRejected().subscribe((response) => {
      this.rejected = response.filter(emp => emp.userId?.role === 'employee');
    });
  }
}
