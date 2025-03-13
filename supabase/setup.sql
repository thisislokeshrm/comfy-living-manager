
-- Create apartments table
CREATE TABLE IF NOT EXISTS public.apartments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number TEXT NOT NULL,
    floor INTEGER NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    rent INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'empty' CHECK (status IN ('empty', 'booked')),
    tenant_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create users table to store user profile information
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'tenant' CHECK (role IN ('tenant', 'manager')),
    apartment_id UUID REFERENCES public.apartments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create service_requests table
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apartment_id UUID NOT NULL REFERENCES public.apartments(id),
    tenant_id UUID NOT NULL REFERENCES auth.users(id),
    type TEXT NOT NULL CHECK (type IN ('cleaning', 'maintenance', 'plumbing', 'electrical', 'other')),
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES auth.users(id),
    apartment_id UUID NOT NULL REFERENCES public.apartments(id),
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    description TEXT NOT NULL
);

-- Create locations table
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('temple', 'park', 'gym', 'pool', 'store', 'restaurant', 'parking')),
    description TEXT NOT NULL,
    coordinates_x INTEGER NOT NULL,
    coordinates_y INTEGER NOT NULL
);

-- Insert some sample data for apartments
INSERT INTO public.apartments (number, floor, bedrooms, bathrooms, rent)
VALUES
    ('101', 1, 2, 1, 1200),
    ('102', 1, 1, 1, 900),
    ('103', 1, 2, 1, 1200),
    ('201', 2, 3, 2, 1800),
    ('202', 2, 2, 1, 1300),
    ('203', 2, 1, 1, 950),
    ('301', 3, 3, 2, 1900),
    ('302', 3, 2, 2, 1500),
    ('303', 3, 2, 1, 1250),
    ('304', 3, 1, 1, 1000);

-- Insert sample locations
INSERT INTO public.locations (name, type, description, coordinates_x, coordinates_y)
VALUES
    ('Central Park', 'park', 'Beautiful park with walking trails', 100, 150),
    ('Lakeside Temple', 'temple', 'Peaceful temple by the lake', 220, 100),
    ('Fitness Center', 'gym', '24/7 fitness center with modern equipment', 180, 200),
    ('Community Pool', 'pool', 'Outdoor swimming pool', 150, 250),
    ('Mini Mart', 'store', 'Convenience store for daily needs', 80, 120);

-- Set up RLS (Row Level Security)
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy for apartments - managers can view all, tenants can view their own apartment
CREATE POLICY "Managers can view all apartments" ON public.apartments
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'manager'
        )
    );

CREATE POLICY "Tenants can view their apartment" ON public.apartments
    FOR SELECT TO authenticated
    USING (tenant_id = auth.uid());

-- Policy for service requests - managers can view all, tenants can only see their own
CREATE POLICY "Managers can view all service requests" ON public.service_requests
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'manager'
        )
    );

CREATE POLICY "Tenants can view their service requests" ON public.service_requests
    FOR SELECT TO authenticated
    USING (tenant_id = auth.uid());

CREATE POLICY "Tenants can create service requests" ON public.service_requests
    FOR INSERT TO authenticated
    WITH CHECK (tenant_id = auth.uid());

-- Policy for payments - managers can view all, tenants can only see their own
CREATE POLICY "Managers can view all payments" ON public.payments
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'manager'
        )
    );

CREATE POLICY "Tenants can view their payments" ON public.payments
    FOR SELECT TO authenticated
    USING (tenant_id = auth.uid());

CREATE POLICY "Tenants can create payments" ON public.payments
    FOR INSERT TO authenticated
    WITH CHECK (tenant_id = auth.uid());

-- Policy for locations - all authenticated users can view
CREATE POLICY "All users can view locations" ON public.locations
    FOR SELECT TO authenticated
    USING (true);

-- Policy for users - managers can view all, tenants can only see their own
CREATE POLICY "Managers can view all users" ON public.users
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'manager'
        )
    );

CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT TO authenticated
    USING (id = auth.uid());
