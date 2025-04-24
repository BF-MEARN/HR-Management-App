import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/interfaces/employee';
import { OnboardingApplicationService } from 'src/app/services/onboarding-application.service';
import { selectApprovedApplications, selectPendingApplications, selectRejectedApplications } from 'src/app/store/onboarding/onboarding.selectors';

import * as OnboardingActions from 'src/app/store/onboarding/onboarding.actions';

@Component({
  selector: 'app-onboarding-applications',
  templateUrl: './onboarding-applications.component.html',
  styleUrls: ['./onboarding-applications.component.scss']
})
export class OnboardingApplicationsComponent implements OnInit {
  @Input() selectedTab: number = 0;
  @Output() tabChange = new EventEmitter<number>();
  
  constructor(private onboardingService: OnboardingApplicationService, private router: Router, private store: Store) { }
  
  pending$: Observable<Employee[]> = this.store.select(selectPendingApplications);
  rejected$: Observable<Employee[]> = this.store.select(selectRejectedApplications);
  approved$: Observable<Employee[]> = this.store.select(selectApprovedApplications);

  ngOnInit(): void {
    this.store.dispatch(OnboardingActions.loadPendingApplications());
    this.store.dispatch(OnboardingActions.loadApprovedApplications());
    this.store.dispatch(OnboardingActions.loadRejectedApplications());
  }

  viewApplication(id: string): void {
    const tabMap = ['pending', 'rejected', 'approved'];
    const tab = tabMap[this.selectedTab];

    this.router.navigate(['/hiring/application', id], {
      queryParams: { fromTab: tab }
    });
  }
}
