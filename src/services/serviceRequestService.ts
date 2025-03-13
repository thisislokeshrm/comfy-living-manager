
import { ServiceRequest } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const fetchServiceRequests = async (userId: string, isManager: boolean) => {
  let query = supabase.from('service_requests').select('*');
  
  // If user is tenant, only fetch their requests
  if (!isManager) {
    query = query.eq('tenant_id', userId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching service requests:', error);
    throw error;
  }
  
  return data as ServiceRequest[];
};

export const createServiceRequest = async (request: Omit<ServiceRequest, 'id' | 'created_at'>) => {
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
    
    toast.success('Service request submitted successfully');
  } catch (error) {
    console.error('Error creating service request:', error);
    toast.error('Failed to submit service request');
    throw error;
  }
};

export const updateServiceRequest = async (id: string, status: 'pending' | 'in-progress' | 'completed') => {
  try {
    const { error } = await supabase
      .from('service_requests')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success(`Service request status updated to ${status}`);
  } catch (error) {
    console.error('Error updating service request:', error);
    toast.error('Failed to update service request');
    throw error;
  }
};

export const getServiceRequestsByTenant = (serviceRequests: ServiceRequest[], tenantId: string) => {
  return serviceRequests.filter(req => req.tenant_id === tenantId);
};
