
import { fetchApartments } from './apartmentService';
import { fetchServiceRequests } from './serviceRequestService';
import { fetchPayments } from './paymentService';
import { fetchLocations } from './locationService';
import { fetchUsers } from './userService';
import { User } from '@/types';

export const fetchAllData = async (authUser: User | null) => {
  if (!authUser) return {
    apartments: [],
    serviceRequests: [],
    payments: [],
    locations: [],
    users: []
  };

  try {
    // Fetch apartments (visible to all users)
    const apartments = await fetchApartments();
    
    // Fetch service requests (managers see all, tenants see only theirs)
    const serviceRequests = await fetchServiceRequests(
      authUser.id, 
      authUser.role === 'manager'
    );
    
    // Fetch payments (managers see all, tenants see only theirs)
    const payments = await fetchPayments(
      authUser.id, 
      authUser.role === 'manager'
    );
    
    // Fetch locations (visible to all users)
    const locations = await fetchLocations();
    
    // Fetch users (only for managers)
    const users = await fetchUsers(authUser.role === 'manager');
    
    return {
      apartments,
      serviceRequests,
      payments,
      locations,
      users
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
