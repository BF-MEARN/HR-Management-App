import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUser } from 'src/app/store/auth/auth.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  dashboardStats = [
    { label: 'Total Employees', value: 120, icon: 'people' },
    { label: 'Pending Visas', value: 7, icon: 'assignment_late' },
    { label: 'New Hires', value: 4, icon: 'person_add' },
  ];

  reminders = [
    'Review visa applications',
    'Approve 2 onboarding requests',
    'Schedule HR team meeting',
  ];

  upcomingEvents = [
    { date: 'Apr 20', event: 'Orientation for New Hires' },
    { date: 'Apr 22', event: 'Visa Review Deadline' },
  ];

  user$: Observable<any>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
  }
}
