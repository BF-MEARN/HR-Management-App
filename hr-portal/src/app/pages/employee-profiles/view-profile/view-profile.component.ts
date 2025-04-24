import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OnboardingApplicationService } from 'src/app/services/onboarding-application.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent implements OnInit {
  employeeId!: string;
  application: any = null;
  loading = true;
  error = '';
  returnTo: string = '';
  houseId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private onboardingService: OnboardingApplicationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
  
    this.route.queryParams.subscribe((params) => {
      // Check for return navigation parameters
      if (params['returnTo']) {
        this.returnTo = params['returnTo'];
      }
      if (params['houseId']) {
        this.houseId = params['houseId'];
      }
    });
  
    this.onboardingService.getApplicationById(this.employeeId).subscribe({
      next: (data) => {
        this.application = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to fetch application';
        this.loading = false;
        this.snackBar.open('Failed to load application', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  
  handleGoBack(): void {
    // Check if we should return to a specific house detail page
    if (this.returnTo === 'house' && this.houseId) {
      this.router.navigate(['/housing', this.houseId]);
    } else {
      // Default behavior - go back to employee profiles list
      this.router.navigate(['/employee-profiles']);
    }
  }

  handleGoToVisaStatusPage(employeeId: string): void {
    this.router.navigate(['/visa-status', employeeId]);
  }

  // TODO: Implement S3
  handleDownloadDocument(document: any): void {
    if (document?.file) {
      window.open(document.file, '_blank');
    } else {
      this.snackBar.open('Document not available', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}