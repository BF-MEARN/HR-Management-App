import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile-section',
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.scss']
})
export class ProfileSectionComponent {
  @Input() application: any;
  @Input() showFeedbackSection = false;
  @Input() showActionButtons = false;
  @Input() feedback = '';
  @Input() pageTitle = 'Profile Details';

  @Output() goBackEvent = new EventEmitter<void>();
  @Output() approveEvent = new EventEmitter<void>();
  @Output() rejectEvent = new EventEmitter<void>();
  @Output() downloadDocumentEvent = new EventEmitter<any>();
  @Output() goToVisaStatusPageEvent = new EventEmitter<string>();
  @Output() feedbackChange = new EventEmitter<string>();

  showFullSSN = false;

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

  downloadDocument(document: any): void {
    this.downloadDocumentEvent.emit(document);
  }

  goToVisaStatusPage(employeeId: string): void {
    this.goToVisaStatusPageEvent.emit(employeeId);
  }

  onFeedbackChange(value: string): void {
    this.feedback = value;
    this.feedbackChange.emit(value);
  }
}