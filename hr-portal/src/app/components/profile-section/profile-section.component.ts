import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { S3DocumentService } from 'src/app/services/s3-document.service';

@Component({
  selector: 'app-profile-section',
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.scss']
})
export class ProfileSectionComponent implements OnInit {
  @Input() application: any;
  @Input() showFeedbackSection = false;
  @Input() showActionButtons = false;
  @Input() feedback = '';
  @Input() pageTitle = 'Profile Details';
  @Input() profilePictureUrl?: string;


  @Output() goBackEvent = new EventEmitter<void>();
  @Output() approveEvent = new EventEmitter<void>();
  @Output() rejectEvent = new EventEmitter<void>();
  @Output() downloadDocumentEvent = new EventEmitter<any>();
  @Output() goToVisaStatusPageEvent = new EventEmitter<string>();
  @Output() feedbackChange = new EventEmitter<string>();
  @Output() previewDocumentEvent = new EventEmitter<any>();


  showFullSSN = false;

  constructor(private s3Service: S3DocumentService) {}
  ngOnInit(): void {
    if (this.application?.profilePicture) {
      // If it's a URL (already uploaded directly), just use it
      if (this.application.profilePicture.startsWith('http')) {
        this.profilePictureUrl = this.application.profilePicture;
      } 
      else {
        // Otherwise assume it's a file key and fetch signed URL
        this.s3Service.getPresignedUrl(this.application.profilePicture).subscribe({
          next: (res) => {
            this.profilePictureUrl = res.url;
          },
          error: (err) => {
            console.error('Failed to load profile picture:', err);
          }
        });
      }
    }
  }

  get statusClass(): any {
    return {
      pending: this.application?.onboardingStatus === 'Pending',
      approved: this.application?.onboardingStatus === 'Approved',
      rejected: this.application?.onboardingStatus === 'Rejected',
    };
  }
  
  get citizenshipClass(): Record<string, boolean> {
    return {
      citizen: this.application?.isCitizenOrPR === true,
      'non-citizen': this.application?.isCitizenOrPR === false,
    };
  }

  getStatusIcon(): string {
    switch (this.application?.onboardingStatus) {
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

  formatGender(gender: string | undefined): string {
    if (!gender) return 'Not provided';
    return gender.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }
  
  toggleSSNVisibility(): void {
    this.showFullSSN = !this.showFullSSN;
  }

  goBack(): void {
    this.goBackEvent.emit();
  }

  approve(): void {
    this.approveEvent.emit();
  }

  reject(): void {
    this.rejectEvent.emit();
  }

  downloadDocument(documentType: string | any): void {
    // If a string is passed, it's a visa document type
    if (typeof documentType === 'string') {
      this.downloadDocumentEvent.emit({
        type: documentType,
        file: this.application?.visaInfo?.[documentType]?.file
      });
    } else {
      // Otherwise, it's an existing document object
      this.downloadDocumentEvent.emit(documentType);
    }
  }

  previewDocument(documentType: string | any): void {
    // If a string is passed, it's a visa document type
    if (typeof documentType === 'string') {
      this.previewDocumentEvent.emit({
        type: documentType,
        file: this.application?.visaInfo?.[documentType]?.file
      });
    } else {
      // Otherwise, it's an existing document object
      this.previewDocumentEvent.emit(documentType);
    }
  }

  goToVisaStatusPage(visaInfoId: string): void {
    this.goToVisaStatusPageEvent.emit(visaInfoId);
  }

  onFeedbackChange(value: string): void {
    this.feedback = value;
    this.feedbackChange.emit(value);
  }

  getDocumentStatusClass(status: string | undefined): Record<string, boolean> {
    return {
      'status-not-uploaded': status === 'Not Uploaded' || !status,
      'status-pending': status === 'Pending Approval',
      'status-approved': status === 'Approved',
      'status-rejected': status === 'Rejected'
    };
  }
}