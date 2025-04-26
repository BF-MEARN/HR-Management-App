import { Contact } from './employeeTypes';

export type UploadedFile = {
  name: string;
  previewUrl: string;
  s3Key?: string;
};

export type Gender = 'male' | 'female' | 'prefer_not_to_say';
export interface PersonalInfoFormData {
  // Names
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;

  // Contact
  cellPhone: string;
  workPhone?: string;
  email: string; // pre-filled, read-only

  // Address
  address: {
    building?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  // Profile
  profilePicture?: UploadedFile;

  // Identity
  ssn: string; // ###-##-####
  dob: string; // ISO string or Date
  gender: Gender;
}

export const emptyPersonalInfoFormData: PersonalInfoFormData = {
  firstName: '',
  lastName: '',
  middleName: '',
  preferredName: '',
  cellPhone: '',
  workPhone: '',
  email: '',
  address: {
    building: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  },

  ssn: '',
  dob: '',
  gender: 'prefer_not_to_say',
};

export interface DriverAndCarFormData {
  hasDriverLicense: boolean;
  driverLicense: {
    number: string;
    expirationDate: string;
    license: UploadedFile;
  };
  hasCar: boolean;
  carInfo: {
    make: string;
    model: string;
    color: string;
  };
}

export const emptyLicenseEntry = {
  number: '',
  expirationDate: '',
  license: {
    name: '',
    previewUrl: '',
    s3Key: '',
  },
};

export const emptyCarEntry = {
  make: '',
  model: '',
  color: '',
};

export const emptyDriverAndCarFormData: DriverAndCarFormData = {
  hasDriverLicense: false,
  driverLicense: emptyLicenseEntry,
  hasCar: false,
  carInfo: emptyCarEntry,
};

const citizenOrPermanentResidentTypes = {
  citizen: 'Citizen',
  green_card: 'Permanent Resident (Green Card)',
};
const foreignerTypes = { 'H1-B': 'H1-B', L2: 'L2', F1: 'F1 (CPT/OPT)', H4: 'H4', other: 'Other' };

export const workAuthorizationCategories = {
  citizenOrPermanentResidentTypes,
  foreignerTypes,
};

export type WorkAuthorizationType =
  | keyof typeof citizenOrPermanentResidentTypes
  | keyof typeof foreignerTypes;

export interface WorkAuthorizationFormData {
  isCitizenOrPermanentResident: boolean;
  authorizationType: WorkAuthorizationType;
  extraAuthInfo: {
    optReceipt?: UploadedFile;
    visaTitle?: string;
    startDate?: string;
    endDate?: string;
  };
}

export const emptyWorkAuthorizationFormData: WorkAuthorizationFormData = {
  isCitizenOrPermanentResident: true,
  authorizationType: 'citizen',
  extraAuthInfo: {},
};

export const emptyContact: Contact = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  relationship: '',
};

export interface ContactFormData {
  hasReference: boolean;
  reference: Contact;
  emergencyContacts: Contact[];
}

export const emptyContactFormData = {
  hasReference: false,
  reference: emptyContact,
  emergencyContacts: [],
};

export interface EmployeeFormPayload {
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  profilePicture?: string;
  ssn: string;
  dob: string;
  address: {
    building?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  gender: 'male' | 'female' | 'prefer_not_to_say';
  contactInfo: {
    cellPhone: string;
    workPhone?: string;
  };

  isCitizenOrPR: boolean;

  visaInfo: {
    workAuthorization: {
      type: string;
      startDate?: string;
      endDate?: string;
      otherTitle?: string;
    };
    optReceipt?: {
      file?: string;
    };
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
}
