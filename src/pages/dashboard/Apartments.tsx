
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Building, User, Home } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Apartments() {
  const { user } = useAuth();
  const { apartments, users } = useData();

  // Only managers should access this page
  if (!user) return null;
  if (user.role !== 'manager') return <Navigate to="/dashboard" />;

  // Group apartments by floor
  const apartmentsByFloor = apartments.reduce((acc, apartment) => {
    const floor = apartment.floor;
    
    if (!acc[floor]) {
      acc[floor] = [];
    }
    
    acc[floor].push(apartment);
    return acc;
  }, {} as Record<number, typeof apartments>);

  // Sort floors in ascending order
  const sortedFloors = Object.keys(apartmentsByFloor)
    .map(Number)
    .sort((a, b) => a - b);

  // Function to get tenant name for an apartment
  const getTenantName = (tenantId?: string) => {
    if (!tenantId) return 'Vacant';
    const tenant = users.find(user => user.id === tenantId);
    return tenant ? tenant.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Apartment Management</h1>
        <p className="text-muted-foreground">
          Overview of all apartment units and their status
        </p>
      </div>

      <div className="grid gap-6">
        {sortedFloors.map(floor => (
          <div key={floor}>
            <h2 className="text-xl font-semibold mb-4">Floor {floor}</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {apartmentsByFloor[floor].map(apartment => (
                <Card 
                  key={apartment.id}
                  className={`${
                    apartment.status === 'booked' 
                      ? 'border-l-4 border-l-apartment-booked' 
                      : 'border-l-4 border-l-apartment-empty'
                  }`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between">
                      <span>Apartment {apartment.number}</span>
                      {apartment.status === 'booked' ? (
                        <User className="h-5 w-5 text-apartment-booked" />
                      ) : (
                        <Home className="h-5 w-5 text-apartment-empty" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`font-medium ${
                          apartment.status === 'booked' 
                            ? 'text-apartment-booked' 
                            : 'text-apartment-empty'
                        }`}>
                          {apartment.status === 'booked' ? 'Occupied' : 'Available'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Bedrooms:</span>
                        <span>{apartment.bedrooms}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Bathrooms:</span>
                        <span>{apartment.bathrooms}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rent:</span>
                        <span>${apartment.rent}/month</span>
                      </div>
                      
                      <div className="flex justify-between text-sm pt-2 border-t">
                        <span className="text-muted-foreground">Tenant:</span>
                        <span>{getTenantName(apartment.tenant_id)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
