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
  fromTab: string = 'all';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private onboardingService: OnboardingApplicationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
  
    this.route.queryParams.subscribe((params) => {
      if (params['fromTab']) {
        this.fromTab = params['fromTab'];
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
    this.router.navigate(['/employee-profiles'], {
      queryParams: { tab: this.fromTab }
    });
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