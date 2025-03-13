
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import DashboardLayout from "./components/DashboardLayout";
import TenantDashboard from "./pages/dashboard/TenantDashboard";
import ManagerDashboard from "./pages/dashboard/ManagerDashboard";
import ServiceRequests from "./pages/dashboard/ServiceRequests";
import Apartments from "./pages/dashboard/Apartments";
import Tenants from "./pages/dashboard/Tenants";
import Map from "./pages/dashboard/Map";
import Payments from "./pages/dashboard/Payments";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/auth/signin" />;
  
  // Render different dashboard based on user role
  return user.role === 'manager' ? <ManagerDashboard /> : <TenantDashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/auth/signin" />} />
              <Route path="/auth/signin" element={<SignIn />} />
              <Route path="/auth/signup" element={<SignUp />} />
              
              {/* Protected dashboard routes */}
              <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
              <Route path="/dashboard/service-requests" element={<DashboardLayout><ServiceRequests /></DashboardLayout>} />
              <Route path="/dashboard/apartments" element={<DashboardLayout><Apartments /></DashboardLayout>} />
              <Route path="/dashboard/tenants" element={<DashboardLayout><Tenants /></DashboardLayout>} />
              <Route path="/dashboard/map" element={<DashboardLayout><Map /></DashboardLayout>} />
              <Route path="/dashboard/payments" element={<DashboardLayout><Payments /></DashboardLayout>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
