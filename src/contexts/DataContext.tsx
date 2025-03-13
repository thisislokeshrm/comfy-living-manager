
import React, { createContext, useContext, useState } from 'react';
import { Apartment, ServiceRequest, PaymentInfo, Location, User, UserRole, ServiceType } from '@/types';
import { toast } from 'sonner';

// Mock data for apartments
const mockApartments: Apartment[] = [
  { id: '1', number: '101', floor: 1, bedrooms: 2, bathrooms: 1, rent: 1200, status: 'booked', tenant_id: '2' },
  { id: '2', number: '102', floor: 1, bedrooms: 1, bathrooms: 1, rent: 900, status: 'booked', tenant_id: '3' },
  { id: '3', number: '103', floor: 1, bedrooms: 2, bathrooms: 1, rent: 1200, status: 'empty' },
  { id: '4', number: '201', floor: 2, bedrooms: 3, bathrooms: 2, rent: 1800, status: 'empty' },
  { id: '5', number: '202', floor: 2, bedrooms: 2, bathrooms: 1, rent: 1300, status: 'empty' },
  { id: '6', number: '203', floor: 2, bedrooms: 1, bathrooms: 1, rent: 950, status: 'empty' },
  { id: '7', number: '301', floor: 3, bedrooms: 3, bathrooms: 2, rent: 1900, status: 'empty' },
  { id: '8', number: '302', floor: 3, bedrooms: 2, bathrooms: 2, rent: 1500, status: 'empty' },
  { id: '9', number: '303', floor: 3, bedrooms: 2, bathrooms: 1, rent: 1250, status: 'empty' },
  { id: '10', number: '304', floor: 3, bedrooms: 1, bathrooms: 1, rent: 1000, status: 'empty' },
];

// Mock data for service requests
const mockServiceRequests: ServiceRequest[] = [
  { 
    id: '1', 
    apartment_id: '1', 
    tenant_id: '2', 
    type: 'cleaning', 
    description: 'Need apartment cleaned', 
    status: 'pending',
    created_at: '2023-04-12T10:30:00Z'
  },
  { 
    id: '2', 
    apartment_id: '2', 
    tenant_id: '3', 
    type: 'maintenance', 
    description: 'The sink is leaking', 
    status: 'in-progress',
    created_at: '2023-04-10T08:15:00Z',
    updated_at: '2023-04-11T14:20:00Z'
  }
];

// Mock payments data
const mockPayments: PaymentInfo[] = [
  {
    id: '1',
    tenant_id: '2',
    apartment_id: '1',
    amount: 1200,
    status: 'completed',
    date: '2023-04-01T00:00:00Z',
    description: 'April Rent'
  },
  {
    id: '2',
    tenant_id: '3',
    apartment_id: '2',
    amount: 900,
    status: 'completed',
    date: '2023-04-02T00:00:00Z',
    description: 'April Rent'
  }
];

// Mock locations data
const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Central Park',
    type: 'park',
    description: 'Beautiful park with walking trails',
    coordinates: { x: 100, y: 150 }
  },
  {
    id: '2',
    name: 'Lakeside Temple',
    type: 'temple',
    description: 'Peaceful temple by the lake',
    coordinates: { x: 220, y: 100 }
  },
  {
    id: '3',
    name: 'Fitness Center',
    type: 'gym',
    description: '24/7 fitness center with modern equipment',
    coordinates: { x: 180, y: 200 }
  },
  {
    id: '4',
    name: 'Community Pool',
    type: 'pool',
    description: 'Outdoor swimming pool',
    coordinates: { x: 150, y: 250 }
  },
  {
    id: '5',
    name: 'Mini Mart',
    type: 'store',
    description: 'Convenience store for daily needs',
    coordinates: { x: 80, y: 120 }
  }
];

// Mock users data
const mockUsers: User[] = [
  { id: '1', email: 'manager@example.com', name: 'Admin Manager', role: 'manager' },
  { id: '2', email: 'tenant1@example.com', name: 'John Doe', role: 'tenant', apartment_id: '1' },
  { id: '3', email: 'tenant2@example.com', name: 'Jane Smith', role: 'tenant', apartment_id: '2' }
];

interface DataContextType {
  apartments: Apartment[];
  serviceRequests: ServiceRequest[];
  payments: PaymentInfo[];
  locations: Location[];
  users: User[];
  
  // Apartment methods
  getApartmentById: (id: string) => Apartment | undefined;
  getApartmentsByStatus: (status: 'empty' | 'booked') => Apartment[];
  
  // Service request methods
  createServiceRequest: (request: Omit<ServiceRequest, 'id' | 'created_at'>) => void;
  updateServiceRequest: (id: string, status: 'pending' | 'in-progress' | 'completed') => void;
  getServiceRequestsByTenant: (tenantId: string) => ServiceRequest[];
  
  // Payment methods
  createPayment: (payment: Omit<PaymentInfo, 'id' | 'status' | 'date'>) => Promise<PaymentInfo>;
  getPaymentsByTenant: (tenantId: string) => PaymentInfo[];
  
  // User methods
  createUser: (user: Omit<User, 'id'>) => void;
  getUserById: (id: string) => User | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apartments, setApartments] = useState<Apartment[]>(mockApartments);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(mockServiceRequests);
  const [payments, setPayments] = useState<PaymentInfo[]>(mockPayments);
  const [locations] = useState<Location[]>(mockLocations);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Apartment methods
  const getApartmentById = (id: string) => {
    return apartments.find(apt => apt.id === id);
  };

  const getApartmentsByStatus = (status: 'empty' | 'booked') => {
    return apartments.filter(apt => apt.status === status);
  };

  // Service request methods
  const createServiceRequest = (request: Omit<ServiceRequest, 'id' | 'created_at'>) => {
    const newRequest: ServiceRequest = {
      ...request,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    
    setServiceRequests(prev => [...prev, newRequest]);
    toast.success('Service request submitted successfully');
  };

  const updateServiceRequest = (id: string, status: 'pending' | 'in-progress' | 'completed') => {
    setServiceRequests(prev => 
      prev.map(req => 
        req.id === id 
          ? { ...req, status, updated_at: new Date().toISOString() } 
          : req
      )
    );
    toast.success(`Service request status updated to ${status}`);
  };

  const getServiceRequestsByTenant = (tenantId: string) => {
    return serviceRequests.filter(req => req.tenant_id === tenantId);
  };

  // Payment methods
  const createPayment = async (payment: Omit<PaymentInfo, 'id' | 'status' | 'date'>): Promise<PaymentInfo> => {
    // Simulate payment processing
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 80% chance of success
        const isSuccessful = Math.random() < 0.8;
        
        if (isSuccessful) {
          const newPayment: PaymentInfo = {
            ...payment,
            id: Math.random().toString(36).substring(2, 9),
            status: 'completed',
            date: new Date().toISOString(),
          };
          
          setPayments(prev => [...prev, newPayment]);
          toast.success('Payment processed successfully');
          resolve(newPayment);
        } else {
          const failedPayment: PaymentInfo = {
            ...payment,
            id: Math.random().toString(36).substring(2, 9),
            status: 'failed',
            date: new Date().toISOString(),
          };
          
          setPayments(prev => [...prev, failedPayment]);
          toast.error('Payment processing failed');
          reject(new Error('Payment failed'));
        }
      }, 1500); // Simulate processing time
    });
  };

  const getPaymentsByTenant = (tenantId: string) => {
    return payments.filter(payment => payment.tenant_id === tenantId);
  };

  // User methods
  const createUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    setUsers(prev => [...prev, newUser]);
    toast.success('User created successfully');
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  return (
    <DataContext.Provider 
      value={{
        apartments,
        serviceRequests,
        payments,
        locations,
        users,
        getApartmentById,
        getApartmentsByStatus,
        createServiceRequest,
        updateServiceRequest,
        getServiceRequestsByTenant,
        createPayment,
        getPaymentsByTenant,
        createUser,
        getUserById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
