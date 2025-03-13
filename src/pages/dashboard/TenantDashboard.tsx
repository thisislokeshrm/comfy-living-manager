
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Home, Bell, CreditCard, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TenantDashboard() {
  const { user } = useAuth();
  const { serviceRequests, apartments, getServiceRequestsByTenant, getPaymentsByTenant } = useData();

  if (!user || user.role !== 'tenant') return null;

  const userServiceRequests = getServiceRequestsByTenant(user.id);
  const pendingServiceRequests = userServiceRequests.filter(req => req.status === 'pending');
  
  const userPayments = getPaymentsByTenant(user.id);
  const recentPayments = userPayments.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 3);

  const userApartment = user.apartment_id ? 
    apartments.find(apt => apt.id === user.apartment_id) : 
    undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your apartment today.
          </p>
        </div>
      </div>

      {userApartment && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Your Apartment</CardTitle>
            <CardDescription>Apartment details and information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Number</span>
                <span className="font-medium">{userApartment.number}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Floor</span>
                <span className="font-medium">{userApartment.floor}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Bedrooms</span>
                <span className="font-medium">{userApartment.bedrooms}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Bathrooms</span>
                <span className="font-medium">{userApartment.bathrooms}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Monthly Rent</span>
                <span className="font-medium">${userApartment.rent}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <span>Service Requests</span>
            </CardTitle>
            <CardDescription>Your active service requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingServiceRequests.length > 0 ? (
                pendingServiceRequests.map(request => (
                  <div key={request.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                    <div className="font-medium">{request.type}</div>
                    <div className="text-sm text-muted-foreground">{request.description}</div>
                    <div className="text-xs mt-1">
                      Status: <span className="font-medium">{request.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground py-2">No pending service requests</div>
              )}
              <Button asChild className="w-full mt-2">
                <Link to="/dashboard/service-requests">
                  View All Requests
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>Recent Payments</span>
            </CardTitle>
            <CardDescription>Your recent payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.length > 0 ? (
                recentPayments.map(payment => (
                  <div key={payment.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                    <div className="font-medium">{payment.description}</div>
                    <div className="text-sm text-muted-foreground">
                      ${payment.amount} - {new Date(payment.date).toLocaleDateString()}
                    </div>
                    <div className="text-xs mt-1">
                      Status: <span className={payment.status === 'completed' ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>{payment.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground py-2">No recent payments</div>
              )}
              <Button asChild className="w-full mt-2">
                <Link to="/dashboard/payments">
                  View All Payments
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Community Map</span>
            </CardTitle>
            <CardDescription>Explore important locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <MapPin className="h-12 w-12 mx-auto text-primary/70 mb-2" />
              <p className="text-muted-foreground mb-4">
                Find important locations near your apartment
              </p>
              <Button asChild className="w-full">
                <Link to="/dashboard/map">
                  View Map
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
