
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { User, UserPlus, Home } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Tenants() {
  const { user } = useAuth();
  const { users, apartments, createUser } = useData();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [apartmentId, setApartmentId] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Only managers should access this page
  if (!user) return null;
  if (user.role !== 'manager') return <Navigate to="/dashboard" />;

  // Filter to show only tenants
  const tenants = users.filter(u => u.role === 'tenant');
  
  // Available apartments (status is empty)
  const availableApartments = apartments.filter(apt => apt.status === 'empty');

  const handleCreateTenant = () => {
    createUser({
      name,
      email,
      role: 'tenant',
      apartment_id: apartmentId || undefined
    });

    setName('');
    setEmail('');
    setApartmentId('');
    setDialogOpen(false);
  };

  // Helper to get apartment details
  const getApartmentDetails = (id?: string) => {
    if (!id) return 'No apartment assigned';
    const apartment = apartments.find(apt => apt.id === id);
    return apartment ? `Apartment ${apartment.number}` : 'Unknown apartment';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
          <p className="text-muted-foreground">
            Manage tenant profiles and apartment assignments
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tenant</DialogTitle>
              <DialogDescription>
                Fill in the tenant details and assign an apartment if needed
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apartment">Assign Apartment (Optional)</Label>
                <Select value={apartmentId} onValueChange={setApartmentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select apartment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No apartment</SelectItem>
                    {availableApartments.map(apt => (
                      <SelectItem key={apt.id} value={apt.id}>
                        Apartment {apt.number} ({apt.bedrooms} BR, ${apt.rent})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateTenant}>Create Tenant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {tenants.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <User className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No tenants found</p>
              <p className="text-muted-foreground">
                Click the "Add New Tenant" button to create a tenant
              </p>
            </CardContent>
          </Card>
        ) : (
          tenants.map((tenant) => (
            <Card key={tenant.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>{tenant.name}</span>
                  <User className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{tenant.email}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Apartment:</span>
                    <span className="flex items-center gap-1">
                      {tenant.apartment_id && <Home className="h-3 w-3" />}
                      {getApartmentDetails(tenant.apartment_id)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
