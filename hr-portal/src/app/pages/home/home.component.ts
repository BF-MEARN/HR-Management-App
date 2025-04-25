import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { selectUser } from 'src/app/store/auth/auth.selectors';
import { EmployeeService } from '../../services/employee.service';
import { HousingManagementService } from '../../services/housing-management.service';
import { OnboardingApplicationService } from '../../services/onboarding-application.service';
import { VisaManagementService } from '../../services/visa-management.service';

// Define interfaces for typed data
interface DashboardStat {
  label: string;
  value: number;
  icon: string;
  color: string;
}

interface PendingTask {
  title: string;
  icon: string;
  route: string;
  priority: 'high' | 'medium' | 'low';
}

interface RecentActivity {
  type: string;
  message: string;
  timestamp: Date;
  icon: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // Observable for dashboard metrics
  dashboardStats$: Observable<DashboardStat[]>;
  
  // Observable for pending tasks that need attention
  pendingTasks$: Observable<PendingTask[]>;
  
  // Observable for recent activities
  recentActivities$: Observable<RecentActivity[]>;
  
  // Loading state
  isLoading = true;
  
  // Error state
  hasError = false;
  errorMessage = '';
  
  // User data
  user$: Observable<any>;

  constructor(
    private store: Store,
    private employeeService: EmployeeService,
    private onboardingService: OnboardingApplicationService,
    private visaService: VisaManagementService,
    private housingService: HousingManagementService
  ) {
    this.user$ = this.store.select(selectUser);
    
    // Initialize observables with proper types
    this.dashboardStats$ = of<DashboardStat[]>([]);
    this.pendingTasks$ = of<PendingTask[]>([]);
    this.recentActivities$ = of<RecentActivity[]>([]);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Combine all data sources
    combineLatest([
      this.employeeService.getAllEmployees().pipe(catchError(err => {
        console.error('Error loading employees', err);
        return of([]);
      })),
      this.onboardingService.getPending().pipe(catchError(err => {
        console.error('Error loading pending applications', err);
        return of([]);
      })),
      this.visaService.getInProgressStatuses().pipe(catchError(err => {
        console.error('Error loading visa statuses', err);
        return of([]);
      })),
      this.housingService.getAllHouses().pipe(catchError(err => {
        console.error('Error loading houses', err);
        return of([]);
      }))
    ]).subscribe({
      next: ([employees, pendingApplications, inProgressVisas, houses]) => {

        const nonHrEmployees = employees.filter(emp => emp.userId?.role === 'employee');

      
        this.dashboardStats$ = of<DashboardStat[]>([
          { label: 'Total Employees', value: nonHrEmployees.length, icon: 'people', color: '#3f51b5' },
          { label: 'Pending Applications', value: pendingApplications.length, icon: 'assignment', color: '#ff9800' },
          { label: 'Visa Processing', value: inProgressVisas.length, icon: 'assignment_late', color: '#f44336' },
          { label: 'Housing Units', value: houses.length, icon: 'home', color: '#4caf50' }
        ]);
      
        const tasks: PendingTask[] = [];
      
        if (pendingApplications.length > 0) {
          tasks.push({
            title: `Review ${pendingApplications.length} pending onboarding applications`,
            icon: 'assignment',
            route: '/onboarding-application/pending',
            priority: 'high'
          });
        }
      
        if (inProgressVisas.length > 0) {
          tasks.push({
            title: `Process ${inProgressVisas.length} visa documents waiting for approval`,
            icon: 'assignment_late',
            route: '/visa-status-management',
            priority: 'medium'
          });
        }
      
        this.pendingTasks$ = of(tasks);
      
        const activities: RecentActivity[] = [];
        if (pendingApplications.length > 0) {
          pendingApplications.slice(0, 3).forEach(app => {
            activities.push({
              type: 'application',
              message: `New onboarding application from ${app.firstName} ${app.lastName}`,
              timestamp: new Date(),
              icon: 'person_add'
            });
          });
        }
      
        this.recentActivities$ = of(activities);
        this.isLoading = false;
      },
      
      error: (err) => {
        console.error('Error loading dashboard data', err);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Error loading dashboard data. Please try again later.';
      }
    });
  }
  
  // Method to refresh dashboard data
  refreshData(): void {
    this.loadDashboardData();
  }
}