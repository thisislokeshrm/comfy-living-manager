
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { CreditCard, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Payments() {
  const { user } = useAuth();
  const { getPaymentsByTenant, createPayment, apartments } = useData();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Only tenants should access this page
  if (!user) return null;
  if (user.role !== 'tenant') return <Navigate to="/dashboard" />;

  const userPayments = getPaymentsByTenant(user.id);
  
  // Get user's apartment details
  const userApartment = user.apartment_id ? 
    apartments.find(apt => apt.id === user.apartment_id) : 
    undefined;

  const handleMakePayment = async () => {
    if (!user.apartment_id) return;
    
    setIsProcessing(true);
    
    try {
      await createPayment({
        tenant_id: user.id,
        apartment_id: user.apartment_id,
        amount: Number(amount),
        description: description || 'Rent Payment',
      });
      
      setAmount('');
      setDescription('');
      setDialogOpen(false);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Manage your rent and other payments
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <DollarSign className="mr-2 h-4 w-4" />
              Make Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Make a Payment</DialogTitle>
              <DialogDescription>
                Enter the payment details below
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {userApartment && (
                <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">Monthly Rent:</span>
                  <span className="text-sm">${userApartment.rent}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="April Rent"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleMakePayment} 
                disabled={isProcessing || !amount}
              >
                {isProcessing ? 'Processing...' : 'Process Payment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            Your recent payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6">
              <CreditCard className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No payment history</p>
              <p className="text-muted-foreground">
                Your payment history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userPayments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    {payment.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(payment.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                      payment.status === 'completed' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${payment.amount.toFixed(2)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
