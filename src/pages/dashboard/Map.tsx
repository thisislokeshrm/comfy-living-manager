
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Location } from '@/types';
import { TreeDeciduous, HomeIcon, Building as BuildingIcon, Dumbbell, Waves, ShoppingCart, UtensilsCrossed, ParkingCircle } from 'lucide-react';

export default function Map() {
  const { user } = useAuth();
  const { locations } = useData();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const getIconForLocationType = (type: string) => {
    switch (type) {
      case 'temple':
        return <BuildingIcon className="h-6 w-6 text-purple-500" />;
      case 'park':
        return <TreeDeciduous className="h-6 w-6 text-green-500" />;
      case 'gym':
        return <Dumbbell className="h-6 w-6 text-red-500" />;
      case 'pool':
        return <Waves className="h-6 w-6 text-blue-500" />;
      case 'store':
        return <ShoppingCart className="h-6 w-6 text-yellow-500" />;
      case 'restaurant':
        return <UtensilsCrossed className="h-6 w-6 text-orange-500" />;
      case 'parking':
        return <ParkingCircle className="h-6 w-6 text-gray-500" />;
      default:
        return <HomeIcon className="h-6 w-6 text-black" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Community Map</h1>
        <p className="text-muted-foreground">
          Explore important places around your apartment
        </p>
      </div>
      
      <Card>
        <CardContent className="p-0 overflow-hidden">
          <div className="relative">
            {/* The apartment complex background */}
            <div 
              ref={mapRef}
              className="bg-slate-100 relative w-full h-[500px] overflow-hidden border-b"
            >
              {/* Central apartment building */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center">
                  <HomeIcon className="h-16 w-16 text-primary" />
                  <span className="text-xs font-bold bg-white px-2 py-1 rounded-full shadow-sm mt-1">
                    Your Apartment
                  </span>
                </div>
              </div>
              
              {/* Location pins */}
              {locations.map((location) => (
                <div 
                  key={location.id}
                  className="absolute cursor-pointer transition-transform hover:scale-110"
                  style={{ 
                    left: `${location.coordinates.x}px`, 
                    top: `${location.coordinates.y}px`
                  }}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="flex flex-col items-center">
                    {getIconForLocationType(location.type)}
                    <span className="text-xs font-medium bg-white px-2 py-0.5 rounded-full shadow-sm mt-1 whitespace-nowrap">
                      {location.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Location details panel */}
            {selectedLocation && (
              <div className="p-4 border-t">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getIconForLocationType(selectedLocation.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedLocation.name}</h3>
                    <p className="text-muted-foreground capitalize">
                      {selectedLocation.type}
                    </p>
                    <p className="mt-2">{selectedLocation.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {locations.map((location) => (
          <Card 
            key={location.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedLocation(location)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="mt-2 mb-3">
                {getIconForLocationType(location.type)}
              </div>
              <h3 className="font-medium text-sm">{location.name}</h3>
              <p className="text-xs text-muted-foreground capitalize">{location.type}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
