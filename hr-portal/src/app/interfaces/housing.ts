export interface Facility {
  beds: number;
  mattresses: number;
  tables: number;
  chairs: number;
}

export interface Landlord {
  fullName: string;
  phone: string;
  email: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  building?: string;
}

export interface Housing {
  _id: string;
  address: Address;
  landlord: Landlord;
  facility: Facility;
  residents: string[];
}

export interface Resident {
  _id: string;
  preferredName?: string;
  firstName?: string;
  lastName?: string;
  contactInfo?: {
    cellPhone?: string;
  };
  email?: string;
  carInfo?: {
    make?: string;
    model?: string;
    color?: string;
  };
  userId?: {
    email?: string;
  };
}

export interface FacilityReport {
  _id: string;
  houseId: string;
  employeeId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    preferredName?: string;
    userId?: {
      username?: string;
      email?: string;
    };
  };
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  description: string;
  timestamp: string;
  createdBy: {
    _id: string;
    firstName?: string;
    lastName?: string;
    preferredName?: string;
  };
}
