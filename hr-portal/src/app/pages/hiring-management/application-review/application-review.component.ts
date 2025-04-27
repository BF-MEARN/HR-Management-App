import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OnboardingApplicationService } from 'src/app/services/onboarding-application.service';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { S3DocumentService } from 'src/app/services/s3-document.service';

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
  feedback = '';
  isLoading = false;
  fromTab: string = 'pending';
  profilePictureUrl?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private onboardingService: OnboardingApplicationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private docService: S3DocumentService 
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
    this.router.navigate(['/hiring'], {
      queryParams: { tab: this.fromTab }
    });
  }

  handleApprove(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Approve Application',
        message: 'Are you sure you want to approve and assign housing to this employee?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.onboardingService.approveAndAssignHousing(this.employeeId).subscribe({
          next: () => {
            this.application.onboardingStatus = 'Approved';
            this.isLoading = false;
            this.snackBar.open('Application approved and housing assigned successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/hiring'], {
              queryParams: { tab: this.fromTab }
            });
          },
          error: (error) => {
            console.error('Failed to approve and assign housing:', error);
            this.isLoading = false;
            this.snackBar.open('Failed to approve and assign housing', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }


  handleReject(): void {
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

  handleGoToVisaStatusPage(employeeId: string): void {
    this.router.navigate(['/visa-status', employeeId]);
  }
 
  handleFeedbackChange(value: string): void {
    this.feedback = value;
  }

  handleProfilePicturePreview(): void {
    if (this.application?.profilePicture) {
      this.docService.getPresignedUrl(this.application.profilePicture).subscribe({
        next: (res) => {
          this.profilePictureUrl = res.url;
        },
        error: (err) => {
          console.error('Failed to fetch profile picture presigned URL:', err);
          this.profilePictureUrl = undefined;
        }
      });
    }
  }
  


  handlePreviewDocument(document: any): void {
    if (document?.file) {
      this.docService.getPresignedUrl(document.file).subscribe({
        next: (res) => {
          window.open(res.url, '_blank');
        },
        error: (err) => {
          console.error('Failed to fetch presigned URL:', err);
          this.snackBar.open('Failed to open document preview', 'Close', { 
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.snackBar.open('Document not available for preview', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  handleDownloadDocument(documentObj: any): void {
    if (!documentObj?.file) {
      this.snackBar.open('Document not available', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    
    const fileKey = documentObj.file;
    
    this.docService.getDownloadUrl(fileKey).subscribe({
      next: (res) => {
        // Create a link and trigger the download
        const link = window.document.createElement('a');
        link.href = res.url;
        link.style.display = 'none';
        window.document.body.appendChild(link);
        link.click();
        
        // Small delay before removal to ensure click is processed
        setTimeout(() => {
          window.document.body.removeChild(link);
        }, 100);
        
        this.snackBar.open('Downloading document...', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Download failed:', err);
        this.snackBar.open('Failed to download document', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}