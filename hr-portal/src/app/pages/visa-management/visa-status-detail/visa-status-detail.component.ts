import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VisaManagementService } from 'src/app/services/visa-management.service';
import { VisaStatus, DocumentStatus } from 'src/app/interfaces/visa-status';
import { RejectDialogComponent } from '../components/reject-dialog/reject-dialog.component';
import { S3DocumentService } from 'src/app/services/s3-document.service';


const visaDocKeys = ['optReceipt', 'optEAD', 'i983', 'i20'] as const;
type VisaDocKey = typeof visaDocKeys[number];

@Component({
  selector: 'app-visa-status-detail',
  templateUrl: './visa-status-detail.component.html',
  styleUrls: ['./visa-status-detail.component.scss']
})
export class VisaStatusDetailComponent implements OnInit {
  visaStatus?: VisaStatus;
  loading = true;
  errorMessage?: string;

  readonly visaDocKeys = visaDocKeys;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private visaService: VisaManagementService,
    private docService: S3DocumentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadVisaStatusData();
  }

  get statusClass() {
    return {
      pending: this.visaStatus?.employeeId?.onboardingStatus === 'Pending',
      approved: this.visaStatus?.employeeId?.onboardingStatus === 'Approved',
      rejected: this.visaStatus?.employeeId?.onboardingStatus === 'Rejected',
    };
  }
  
  getStatusIcon(): string {
    switch (this.visaStatus?.employeeId?.onboardingStatus) {
      case 'Pending':
        return 'hourglass_empty';
      case 'Approved':
        return 'check_circle';
      case 'Rejected':
        return 'cancel';
      default:
        return 'help';
    }
  }
  

  loadVisaStatusData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Invalid visa status ID';
      this.loading = false;
      return;
    }

    this.visaService.getVisaStatusById(id).subscribe({
      next: (data) => {
        this.visaStatus = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load visa detail:', err);
        this.errorMessage = 'Failed to load visa status details';
        this.loading = false;
      }
    });
  }

  hasAnyDocuments(): boolean {
    if (!this.visaStatus) return false;
    
    return visaDocKeys.some(key => 
      this.visaStatus?.[key] && 
      Object.keys(this.visaStatus[key]).length > 0
    );
  }


  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  isOnboardingPending(): boolean {
    return this.visaStatus?.employeeId?.onboardingStatus === 'Pending';
  }
  

  getCurrentPendingDoc(): VisaDocKey | null {
    if (!this.visaStatus) return null;
  
    const order: VisaDocKey[] = ['optReceipt', 'optEAD', 'i983', 'i20'];
    for (const key of order) {
      const doc = this.visaStatus[key];
      if (!doc || doc.status !== 'Approved') {
        return key;
      }
    }
    return null;
  }


  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'Not Uploaded': 'not-uploaded',
      'Pending Approval': 'pending-approval',
      'Approved': 'approved',
      'Rejected': 'rejected'
    };
    return statusMap[status] || '';
  }

  getAuthorizationStatusClass(): string {
    if (!this.visaStatus?.workAuthorization?.type) return '';
    
    const typeMap: Record<string, string> = {
      'F1': 'f1',
      'H1-B': 'h1b',
      'H4': 'h4',
      'L2': 'l2',
      'Green Card': 'green-card',
      'Citizen': 'citizen'
    };
    
    const type = this.visaStatus.workAuthorization.type;
    return typeMap[type] || 'other';
  }

  getDaysRemaining(): number {
    if (!this.visaStatus?.workAuthorization?.endDate) {
      return 0;
    }
    
    const endDate = new Date(this.visaStatus.workAuthorization.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  getDaysRemainingClass(): string {
    const days = this.getDaysRemaining();
    if (days <= 30) return 'days-warning';
    if (days <= 90) return 'days-caution';
    return 'days-good';
  }

  formatDocumentName(key: string): string {
    const nameMap: Record<string, string> = {
      'optReceipt': 'OPT Receipt',
      'optEAD': 'OPT EAD',
      'i983': 'I-983 Form',
      'i20': 'I-20'
    };
    
    return nameMap[key] || key;
  }


  openFile(key: string): void {
    this.docService.getPresignedUrl(key).subscribe({
      next: (res) => {
        window.open(res.url, '_blank');
      },
      error: (err) => {
        console.error('Failed to fetch presigned URL:', err);
        this.snackBar.open('Failed to open document preview', 'Close', { duration: 3000 });
      }
    });
  }
  

  downloadFile(key: string): void {
    this.docService.getDownloadUrl(key).subscribe({
      next: (res) => {
        // Create a link and trigger the download
        const link = document.createElement('a');
        link.href = res.url;
        // No need to set download attribute as the URL already has Content-Disposition: attachment
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Small delay before removal to ensure click is processed
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
        
        // Extract document type for better message
        const docType = this.getDocumentTypeFromKey(key);
        this.snackBar.open(`Downloading ${docType}...`, 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Download failed:', err);
        this.snackBar.open('Failed to download document', 'Close', { duration: 3000 });
      }
    });
  }
  
  // Helper method to get document type from S3 key
  private getDocumentTypeFromKey(key: string): string {
    if (key.includes('optReceipt')) return 'OPT Receipt';
    if (key.includes('optEAD')) return 'OPT EAD';
    if (key.includes('i983')) return 'I-983 Form';
    if (key.includes('i20')) return 'I-20';
    return 'Document';
  }

  getCurrentStepDescription(): string {
    if (!this.visaStatus) return '';
    
    const currentDoc = this.getCurrentPendingDoc();
    if (!currentDoc) return 'All documents approved';
    
    const status = this.visaStatus[currentDoc]?.status;
    
    const descriptionMap: Record<string, Record<string, string>> = {
      'optReceipt': {
        'Not Uploaded': 'Waiting for employee to upload OPT Receipt',
        'Pending Approval': 'OPT Receipt uploaded and waiting for HR approval',
        'Rejected': 'OPT Receipt was rejected - waiting for new upload'
      },
      'optEAD': {
        'Not Uploaded': 'Waiting for employee to upload OPT EAD',
        'Pending Approval': 'OPT EAD uploaded and waiting for HR approval',
        'Rejected': 'OPT EAD was rejected - waiting for new upload'
      },
      'i983': {
        'Not Uploaded': 'Waiting for employee to upload I-983 form',
        'Pending Approval': 'I-983 form uploaded and waiting for HR approval',
        'Rejected': 'I-983 form was rejected - waiting for new upload'
      },
      'i20': {
        'Not Uploaded': 'Waiting for employee to upload I-20',
        'Pending Approval': 'I-20 uploaded and waiting for HR approval',
        'Rejected': 'I-20 was rejected - waiting for new upload'
      }
    };
    
    return status && descriptionMap[currentDoc] ? 
      descriptionMap[currentDoc][status] || `Processing ${this.formatDocumentName(currentDoc)}` :
      `Processing ${this.formatDocumentName(currentDoc)}`;
  }

  openRejectDialog(docKey: VisaDocKey): void {
    const dialogRef = this.dialog.open(RejectDialogComponent, {
      width: '500px',
      data: {
        documentName: this.formatDocumentName(docKey)
      }
    });

    dialogRef.afterClosed().subscribe(feedback => {
      if (feedback) {
        this.rejectDocument(docKey, feedback);
      }
    });
  }

  rejectDocument(docKey: VisaDocKey, feedback: string): void {
    if (!this.visaStatus?._id) return;
    
    this.visaService.rejectDocument(this.visaStatus.employeeId._id, docKey, feedback).subscribe({
      next: () => {
        if (this.visaStatus && this.visaStatus[docKey]) {
          this.visaStatus[docKey].status = 'Rejected';
          this.visaStatus[docKey].feedback = feedback;
        }
        this.snackBar.open(`${this.formatDocumentName(docKey)} has been rejected`, 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Error rejecting document:', err);
        this.snackBar.open('Failed to reject document', 'Close', {
          duration: 3000
        });
      }
    });
  }

  approveDocument(docKey: VisaDocKey): void {
    if (!this.visaStatus?._id) return;
    
    this.visaService.approveDocument(this.visaStatus.employeeId._id, docKey).subscribe({
      next: () => {
        if (this.visaStatus && this.visaStatus[docKey]) {
          this.visaStatus[docKey].status = 'Approved';
          this.visaStatus[docKey].feedback = '';
        }
        this.snackBar.open(`${this.formatDocumentName(docKey)} has been approved`, 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Error approving document:', err);
        this.snackBar.open('Failed to approve document', 'Close', {
          duration: 3000
        });
      }
    });
  }

  sendReminder(): void {
    if (!this.visaStatus?._id) return;
    
    this.visaService.sendReminder(this.visaStatus.employeeId._id).subscribe({
      next: () => {
        this.snackBar.open('Reminder email sent successfully', 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Error sending reminder:', err);
        this.snackBar.open('Failed to send reminder email', 'Close', {
          duration: 3000
        });
      }
    });
  }
}