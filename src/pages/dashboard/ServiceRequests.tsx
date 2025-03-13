
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { CalendarPlus, CheckCircle, Loader2 } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ServiceType } from '@/types';

export default function ServiceRequests() {
  const { user } = useAuth();
  const { 
    serviceRequests, 
    getServiceRequestsByTenant, 
    createServiceRequest, 
    updateServiceRequest 
  } = useData();
  
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ServiceType>('cleaning');
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!user) return null;

  // Manager sees all service requests, tenant sees only their own
  const displayRequests = user.role === 'manager' 
    ? serviceRequests 
    : getServiceRequestsByTenant(user.id);

  const handleCreateRequest = () => {
    if (!user.apartment_id) return;
    
    createServiceRequest({
      apartment_id: user.apartment_id,
      tenant_id: user.id,
      type,
      description,
      status: 'pending'
    });

    setDescription('');
    setType('cleaning');
    setDialogOpen(false);
  };

  const handleUpdateStatus = (id: string, status: 'pending' | 'in-progress' | 'completed') => {
    updateServiceRequest(id, status);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Requests</h1>
          <p className="text-muted-foreground">
            {user.role === 'manager' 
              ? 'Manage service requests from tenants' 
              : 'Request services for your apartment'}
          </p>
        </div>
        {user.role === 'tenant' && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <CalendarPlus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Service Request</DialogTitle>
                <DialogDescription>
                  Fill in the details for your service request
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Service Type</Label>
                  <Select value={type} onValueChange={(value) => setType(value as ServiceType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please describe your request"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateRequest}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="grid gap-4">
        {displayRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <CalendarPlus className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No service requests found</p>
              <p className="text-muted-foreground">
                {user.role === 'tenant' 
                  ? 'Click the "New Request" button to create a service request'
                  : 'No tenants have submitted service requests yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          displayRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="capitalize">{request.type}</CardTitle>
                    <CardDescription>
                      Created: {formatDate(request.created_at)}
                      {request.updated_at && ` · Updated: ${formatDate(request.updated_at)}`}
                    </CardDescription>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {request.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{request.description}</p>
                
                {user.role === 'manager' && (
                  <div className="flex gap-2 justify-end mt-2">
                    {request.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleUpdateStatus(request.id, 'in-progress')}
                      >
                        <Loader2 className="mr-2 h-4 w-4" />
                        Mark In Progress
                      </Button>
                    )}
                    {(request.status === 'pending' || request.status === 'in-progress') && (
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateStatus(request.id, 'completed')}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
