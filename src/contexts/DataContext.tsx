
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Apartment, ServiceRequest, PaymentInfo, Location, User, UserRole, ServiceType } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

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
    
    // Fetch apartments
    const { data: apartmentsData, error: apartmentsError } = await supabase
      .from('apartments')
      .select('*');
    
    if (!apartmentsError && apartmentsData) {
      setApartments(apartmentsData as Apartment[]);
    }
    
    // Fetch service requests (managers see all, tenants see only theirs)
    let serviceRequestsQuery = supabase.from('service_requests').select('*');
    if (authUser.role === 'tenant') {
      serviceRequestsQuery = serviceRequestsQuery.eq('tenant_id', authUser.id);
    }
    
    const { data: serviceRequestsData, error: serviceRequestsError } = await serviceRequestsQuery;
    
    if (!serviceRequestsError && serviceRequestsData) {
      setServiceRequests(serviceRequestsData as ServiceRequest[]);
    }
    
    // Fetch payments (managers see all, tenants see only theirs)
    let paymentsQuery = supabase.from('payments').select('*');
    if (authUser.role === 'tenant') {
      paymentsQuery = paymentsQuery.eq('tenant_id', authUser.id);
    }
    
    const { data: paymentsData, error: paymentsError } = await paymentsQuery;
    
    if (!paymentsError && paymentsData) {
      setPayments(paymentsData as PaymentInfo[]);
    }
    
    // Fetch locations (visible to all users)
    const { data: locationsData, error: locationsError } = await supabase
      .from('locations')
      .select('*');
    
    if (!locationsError && locationsData) {
      // Transform the data to match our Location interface
      const transformedLocations = locationsData.map(loc => ({
        ...loc,
        coordinates: { x: loc.coordinates_x, y: loc.coordinates_y }
      })) as unknown as Location[];
      
      setLocations(transformedLocations);
    }
    
    // Fetch users (only for managers)
    if (authUser.role === 'manager') {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*');
      
      if (!usersError && usersData) {
        setUsers(usersData as User[]);
      }
    }
  };

  // Apartment methods
  const getApartmentById = (id: string) => {
    return apartments.find(apt => apt.id === id);
  };

  const getApartmentsByStatus = (status: 'empty' | 'booked') => {
    return apartments.filter(apt => apt.status === status);
  };

  // Service request methods
  const createServiceRequest = async (request: Omit<ServiceRequest, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .insert({
          apartment_id: request.apartment_id,
          tenant_id: request.tenant_id,
          type: request.type,
          description: request.description,
          status: request.status,
        });
      
      if (error) throw error;
      
      // Refresh service requests
      fetchData();
      toast.success('Service request submitted successfully');
    } catch (error) {
      console.error('Error creating service request:', error);
      toast.error('Failed to submit service request');
    }
  };

  const updateServiceRequest = async (id: string, status: 'pending' | 'in-progress' | 'completed') => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh service requests
      fetchData();
      toast.success(`Service request status updated to ${status}`);
    } catch (error) {
      console.error('Error updating service request:', error);
      toast.error('Failed to update service request');
    }
  };

  const getServiceRequestsByTenant = (tenantId: string) => {
    return serviceRequests.filter(req => req.tenant_id === tenantId);
  };

  // Payment methods
  const createPayment = async (payment: Omit<PaymentInfo, 'id' | 'status' | 'date'>): Promise<PaymentInfo> => {
    // Simulate payment processing with 80% success rate
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        // 80% chance of success
        const isSuccessful = Math.random() < 0.8;
        const status = isSuccessful ? 'completed' : 'failed';
        
        try {
          const { data, error } = await supabase
            .from('payments')
            .insert({
              tenant_id: payment.tenant_id,
              apartment_id: payment.apartment_id,
              amount: payment.amount,
              description: payment.description,
              status,
              date: new Date().toISOString(),
            })
            .select()
            .single();
          
          if (error) throw error;
          
          // Refresh payments
          fetchData();
          
          if (isSuccessful) {
            toast.success('Payment processed successfully');
            resolve(data as PaymentInfo);
          } else {
            toast.error('Payment processing failed');
            reject(new Error('Payment failed'));
          }
        } catch (error) {
          console.error('Error creating payment:', error);
          toast.error('Failed to process payment');
          reject(error);
        }
      }, 1500); // Simulate processing time
    });
  };

  const getPaymentsByTenant = (tenantId: string) => {
    return payments.filter(payment => payment.tenant_id === tenantId);
  };

  // User methods
  const createUser = async (user: Omit<User, 'id'>) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'temporary-password', // This should be changed by the user later
        email_confirm: true,
      });
      
      if (authError || !authData.user) throw authError || new Error('Failed to create user');
      
      // Add to users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          apartment_id: user.apartment_id,
        });
      
      if (profileError) throw profileError;
      
      // Refresh users
      fetchData();
      toast.success('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
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
