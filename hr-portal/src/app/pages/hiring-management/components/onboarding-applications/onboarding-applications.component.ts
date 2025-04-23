import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/interfaces/employee';
import { OnboardingApplicationService } from 'src/app/services/onboarding-application.service';

@Component({
  selector: 'app-onboarding-applications',
  templateUrl: './onboarding-applications.component.html',
  styleUrls: ['./onboarding-applications.component.scss']
})
export class OnboardingApplicationsComponent implements OnInit {
  @Input() selectedTab: number = 0;
  @Output() tabChange = new EventEmitter<number>();

  pending: Employee[] = [];
  approved: Employee[] = [];
  rejected: Employee[] = [];

  constructor(private onboardingService: OnboardingApplicationService, private router: Router) { }

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

  viewApplication(id: string): void {
    const tabMap = ['pending', 'rejected', 'approved'];
    const tab = tabMap[this.selectedTab];

    this.router.navigate(['/application-review', id], {
      queryParams: { fromTab: tab }
    });
  }
}
