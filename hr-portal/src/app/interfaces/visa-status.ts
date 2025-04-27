export interface VisaStatus {
  _id: string;

  workAuthorization: {
    type: string;
    startDate: string;
    endDate: string;
    otherTitle?: string;
  };

  optReceipt: DocumentStatus;
  optEAD: DocumentStatus;
  i983: DocumentStatus;
  i20: DocumentStatus;

  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    preferredName?: string;
    onboardingStatus?: 'Pending' | 'Approved' | 'Rejected';
    userId?: {
      _id: string;
      email?: string;
    };
  };
}

export interface DocumentStatus {
  file: string;
  status: 'Not Uploaded' | 'Pending Approval' | 'Approved' | 'Rejected';
  feedback?: string;
}
