import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OnboardingApplicationService } from 'src/app/services/onboarding-application.service';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-application-review',
  templateUrl: './application-review.component.html',
  styleUrls: ['./application-review.component.scss']
})
export class ApplicationReviewComponent implements OnInit {
  employeeId!: string;
  application: any = null;
  loading = true;
  error = '';
  showReject = false;
  feedback = '';
  isLoading = false;
  fromTab: string = 'pending';
  showFullSSN: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private onboardingService: OnboardingApplicationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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
  


  get statusClass(): any {
    return {
      pending: this.application?.onboardingStatus === 'Pending',
      approved: this.application?.onboardingStatus === 'Approved',
      rejected: this.application?.onboardingStatus === 'Rejected',
    };
  }
  
  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'accent';
      case 'approved':
        return 'primary';
      case 'rejected':
        return 'warn';
      default:
        return '';
    }
  }

  formatGender(gender: string | undefined): string {
    if (!gender) return 'Not provided';
    return gender.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }
  

  get citizenshipClass(): Record<string, boolean> {
    return {
      citizen: this.application?.isCitizenOrPR === true,
      'non-citizen': this.application?.isCitizenOrPR === false,
    };
  }
  
  
  toggleSSNVisibility(): void {
    this.showFullSSN = !this.showFullSSN;
  }

  
  approve(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Approve Application',
        message: 'Are you sure you want to approve this application?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.onboardingService.approveApplication(this.employeeId).subscribe({
          next: () => {
            this.application.onboardingStatus = 'Approved';
            this.isLoading = false;
            this.snackBar.open('Application approved successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/hiring'], {
              queryParams: { tab: this.fromTab }
            });
            
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open('Failed to approve application', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  reject(): void {
    if (!this.feedback || this.feedback.trim().length < 10) {
      this.snackBar.open('Feedback must be at least 10 characters long', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Reject Application',
        message: 'Are you sure you want to reject this application? The feedback will be sent to the applicant.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.onboardingService.rejectApplication(this.employeeId, this.feedback).subscribe({
          next: () => {
            this.application.onboardingStatus = 'Rejected';
            this.application.onboardingFeedback = this.feedback;
            this.showReject = false;
            this.isLoading = false;
            this.snackBar.open('Application rejected. Feedback sent to applicant.', 'Close', {
              duration: 3000,
              panelClass: ['warning-snackbar']
            });
            this.router.navigate(['/hiring'], {
              queryParams: { tab: this.fromTab }
            });
            
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open('Failed to reject application', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/hiring'], {
      queryParams: { tab: this.fromTab }
    });
  }
  
  goToVisaStatusPage(employeeId: string): void {
    this.router.navigate(['/visa-status', employeeId]);
  }
  

  downloadDocument(document: any): void {
    // TODO: Implement download logic & S3
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