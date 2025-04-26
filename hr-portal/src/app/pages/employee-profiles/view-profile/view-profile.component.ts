import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { OnboardingApplicationService } from 'src/app/services/onboarding-application.service';
import { S3DocumentService } from 'src/app/services/s3-document.service';

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
  profilePictureUrl?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private onboardingService: OnboardingApplicationService,
    private snackBar: MatSnackBar,
    private docService: S3DocumentService,
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