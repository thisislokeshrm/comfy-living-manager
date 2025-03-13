
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Apartment, ServiceRequest, PaymentInfo, Location, User } from '@/types';
import { useAuth } from './AuthContext';

// Import services
import { getApartmentById, getApartmentsByStatus } from '@/services/apartmentService';
import { createServiceRequest, updateServiceRequest, getServiceRequestsByTenant } from '@/services/serviceRequestService';
import { createPayment, getPaymentsByTenant } from '@/services/paymentService';
import { createUser, getUserById } from '@/services/userService';
import { fetchAllData } from '@/services/dataFetchService';

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
  createServiceRequest: (request: Omit<ServiceRequest, 'id' | 'created_at'>) => Promise<void>;
  updateServiceRequest: (id: string, status: 'pending' | 'in-progress' | 'completed') => Promise<void>;
  getServiceRequestsByTenant: (tenantId: string) => ServiceRequest[];
  
  // Payment methods
  createPayment: (payment: Omit<PaymentInfo, 'id' | 'status' | 'date'>) => Promise<PaymentInfo>;
  getPaymentsByTenant: (tenantId: string) => PaymentInfo[];
  
  // User methods
  createUser: (user: Omit<User, 'id'>) => Promise<void>;
  getUserById: (id: string) => User | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuth();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [payments, setPayments] = useState<PaymentInfo[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Load data when authenticated
  useEffect(() => {
    if (authUser) {
      fetchData();
    }
  }, [authUser]);
  
  const fetchData = async () => {
    if (!authUser) return;
    
    try {
      const data = await fetchAllData(authUser);
      
      setApartments(data.apartments);
      setServiceRequests(data.serviceRequests);
      setPayments(data.payments);
      setLocations(data.locations);
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Create wrapper functions that call the service functions
  const apartmentById = (id: string) => getApartmentById(apartments, id);
  const apartmentsByStatus = (status: 'empty' | 'booked') => getApartmentsByStatus(apartments, status);
  
  const createServiceRequestWrapper = async (request: Omit<ServiceRequest, 'id' | 'created_at'>) => {
    await createServiceRequest(request);
    fetchData(); // Refresh data after creating
  };
  
  const updateServiceRequestWrapper = async (id: string, status: 'pending' | 'in-progress' | 'completed') => {
    await updateServiceRequest(id, status);
    fetchData(); // Refresh data after updating
  };
  
  const serviceRequestsByTenant = (tenantId: string) => getServiceRequestsByTenant(serviceRequests, tenantId);
  
  const createPaymentWrapper = async (payment: Omit<PaymentInfo, 'id' | 'status' | 'date'>) => {
    const result = await createPayment(payment);
    fetchData(); // Refresh data after creating
    return result;
  };
  
  const paymentsByTenant = (tenantId: string) => getPaymentsByTenant(payments, tenantId);
  
  const createUserWrapper = async (user: Omit<User, 'id'>) => {
    await createUser(user);
    fetchData(); // Refresh data after creating
  };
  
  const userById = (id: string) => getUserById(users, id);

  return (
    <DataContext.Provider 
      value={{
        apartments,
        serviceRequests,
        payments,
        locations,
        users,
        getApartmentById: apartmentById,
        getApartmentsByStatus: apartmentsByStatus,
        createServiceRequest: createServiceRequestWrapper,
        updateServiceRequest: updateServiceRequestWrapper,
        getServiceRequestsByTenant: serviceRequestsByTenant,
        createPayment: createPaymentWrapper,
        getPaymentsByTenant: paymentsByTenant,
        createUser: createUserWrapper,
        getUserById: userById,
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
