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
