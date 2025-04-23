import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OnboardingApplicationService } from 'src/app/services/onboarding-application.service';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';


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
 
  goBack(): void {
    this.router.navigate(['/employee-profiles'], {
      queryParams: { tab: this.fromTab }
    });
  }

  // TODO: Route to visa status page by id
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
