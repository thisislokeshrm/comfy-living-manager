
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Building, Users, ClipboardList, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { apartments, serviceRequests, users } = useData();

  if (!user || user.role !== 'manager') return null;

  const totalApartments = apartments.length;
  const bookedApartments = apartments.filter(apt => apt.status === 'booked').length;
  const occupancyRate = (bookedApartments / totalApartments) * 100;

  const pendingServiceRequests = serviceRequests.filter(req => req.status === 'pending').length;
  const inProgressServiceRequests = serviceRequests.filter(req => req.status === 'in-progress').length;
  const completedServiceRequests = serviceRequests.filter(req => req.status === 'completed').length;
  const totalServiceRequests = serviceRequests.length;

  const tenants = users.filter(u => u.role === 'tenant').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Management Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}. Here's an overview of your property.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/tenants">
            <Users className="mr-2 h-4 w-4" />
            Create New Tenant
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Apartments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApartments}</div>
            <p className="text-xs text-muted-foreground mt-1">10 units available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate.toFixed(0)}%</div>
            <Progress 
              className="h-2 mt-2"
              value={occupancyRate} 
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants}</div>
            <p className="text-xs text-muted-foreground mt-1">{bookedApartments} occupied apartments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServiceRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">{pendingServiceRequests} pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Apartment Status</CardTitle>
            <CardDescription>Overview of all apartments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-apartment-booked"></div>
                  <span>Booked</span>
                </div>
                <span className="font-medium">{bookedApartments}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-apartment-empty"></div>
                  <span>Available</span>
                </div>
                <span className="font-medium">{totalApartments - bookedApartments}</span>
              </div>
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/apartments">
                    View All Apartments
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Requests</CardTitle>
            <CardDescription>Current service request status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-yellow-500" />
                  <span>Pending</span>
                </div>
                <span className="font-medium">{pendingServiceRequests}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  <span>In Progress</span>
                </div>
                <span className="font-medium">{inProgressServiceRequests}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Completed</span>
                </div>
                <span className="font-medium">{completedServiceRequests}</span>
              </div>
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/service-requests">
                    View All Requests
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
