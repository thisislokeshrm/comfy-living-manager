
import { PaymentInfo } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const fetchPayments = async (userId: string, isManager: boolean) => {
  let query = supabase.from('payments').select('*');
  
  // If user is tenant, only fetch their payments
  if (!isManager) {
    query = query.eq('tenant_id', userId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
  
  return data as PaymentInfo[];
};

export const createPayment = async (payment: Omit<PaymentInfo, 'id' | 'status' | 'date'>): Promise<PaymentInfo> => {
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

export const getPaymentsByTenant = (payments: PaymentInfo[], tenantId: string) => {
  return payments.filter(payment => payment.tenant_id === tenantId);
};
