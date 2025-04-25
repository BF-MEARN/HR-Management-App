export interface Contact {
  firstName: string;
  lastName: string;
  middleName?: string;

  phone: string;
  email: string;
  relationship: string;
}

export interface Employee {
  _id: string;
  userId: {
    _id: string;
    email: string;
  };
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  profilePicture?: string;
  ssn: string;
  dob: string; // ISO date string
  gender: 'male' | 'female' | 'prefer_not_to_say';
  isCitizenOrPR: boolean;
  onboardingStatus: 'Not Started' | 'Pending' | 'Approved' | 'Rejected';
  onboardingFeedback?: string;

  contactInfo: {
    cellPhone: string;
    workPhone?: string;
  };

  address: {
    building?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  driverLicense?: {
    number: string;
    expirationDate: string;
    file: string;
  };

  carInfo?: {
    make: string;
    model: string;
    color: string;
  };

  reference?: Contact;

  emergencyContacts: Contact[];

  visaInfo: {
    _id: string;
    employeeId: string;
    workAuthorization: {
      type: string;
      startDate?: string;
      endDate?: string;
      otherTitle?: string;
    };
    optReceipt?: {
      status: string;
      file?: string;
    };
    optEAD?: {
      status: string;
      file?: string;
    };
    i983?: {
      status: string;
      file?: string;
    };
    i20?: {
      status: string;
      file?: string;
    };
    createdAt: string;
    updatedAt: string;
  };

  houseId?: string;
}
