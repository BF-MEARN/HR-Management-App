export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  onboardingStatus: 'Not Started' | 'Pending' | 'Approved' | 'Rejected';
  onboardingFeedback?: string;
  dob?: string;
  gender?: string;
  ssn?: string;
  address?: {
    building?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  isCitizenOrPR?: boolean;
  visaInfo?: {
    visaTitle?: string;
    workAuthorization?: {
      type?: string;
      startDate?: string;
      endDate?: string;
      file?: string;
    };
  };
  contactInfo?: {
    cellPhone?: string;
    workPhone?: string;
  };
  driverLicense?: {
    number?: string;
    expirationDate?: string;
    file?: string;
  };
  reference?: {
    firstName?: string;
    lastName?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  };
  emergencyContacts?: {
    firstName?: string;
    lastName?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  }[];
  carInfo?: {
    make?: string;
    model?: string;
    color?: string;
  };
  userId?: {
    _id: string;
    email: string;
    role: 'hr' | 'employee';
  };
}
