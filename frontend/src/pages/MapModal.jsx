import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Component with the map modal
const DirectionsButton = ({ userLocation, facility }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const mapUrl = `https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=${userLocation.lat},${userLocation.lng}&destination=${facility.location.lat},${facility.location.lng}&mode=driving`;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex-1 rounded-none py-3 h-auto text-blue-600"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Directions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Directions to {facility.name || 'Facility'}</DialogTitle>
        </DialogHeader>
        <div className="w-full h-64 sm:h-96">
          <iframe
            title="Google Maps Directions"
            width="100%"
            height="100%"
            frameBorder="0"
            src={mapUrl}
            allowFullScreen
          ></iframe>
        </div>
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
          <Button 
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${facility.location.lat},${facility.location.lng}`,
                '_blank'
              );
            }}
          >
            Open in Google Maps
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DirectionsButton;