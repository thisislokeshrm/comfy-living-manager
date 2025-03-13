
export type UserRole = 'tenant' | 'manager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  apartment_id?: string;
}

export interface Apartment {
  id: string;
  number: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  status: 'empty' | 'booked';
  tenant_id?: string;
}

export type ServiceType = 'cleaning' | 'maintenance' | 'plumbing' | 'electrical' | 'other';

export interface ServiceRequest {
  id: string;
  apartment_id: string;
  tenant_id: string;
  type: ServiceType;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  created_at: string;
  updated_at?: string;
}

export interface PaymentInfo {
  id: string;
  tenant_id: string;
  apartment_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  description: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'temple' | 'park' | 'gym' | 'pool' | 'store' | 'restaurant' | 'parking';
  description: string;
  coordinates: {
    x: number;
    y: number;
  };
}
