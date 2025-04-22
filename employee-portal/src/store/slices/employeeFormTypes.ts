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
  profilePictureFileName?: string; // actual file handled by component ref
  profilePicturePreview?: string;

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
    licenseFileName?: string;
    licensePreview?: string;
  };
  hasCar: boolean;
  carInfo: {
    make: string;
    model: string;
    color: string;
  };
}

const emptyLicenseEntry = { number: '', expirationDate: '' };

const emptyCarEntry = {
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
const foreignerTypes = { 'h1-b': 'H1-B', l2: 'L2', f1: 'F1 (CPT/OPT)', h4: 'H4', other: 'Other' };

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
    f1DocumentName?: string;
    f1DocumentPreview?: string;
    visaTitle?: string;
    startDate: string;
    endDate: string;
  };
}

export const emptyWorkAuthorizationFormData: WorkAuthorizationFormData = {
  isCitizenOrPermanentResident: true,
  authorizationType: 'citizen',
  extraAuthInfo: {
    startDate: '',
    endDate: '',
  },
};

export interface Contact {
  firstName: string;
  lastName: string;
  middleName?: string;

  phone: string;
  email: string;
  relationship: string;
}

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
