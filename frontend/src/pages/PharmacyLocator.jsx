import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Phone, Star, Clock, Filter, ChevronDown, ChevronUp, Users, Loader } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';

const   PharmacyLocator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [distance, setDistance] = useState([5000]);
  const [selectedType, setSelectedType] = useState('pharmacy');
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [dbHospitals, setDbHospitals] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  
  // Google Maps API loader
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC5pnj_yE8KEUThBlHUFP6dNwlDj2EiU5Y' // Replace with your actual API key
  });
  useEffect(() => {
    // Fetch hospitals from database when component mounts
    fetchHospitalsFromDatabase();
  }, []);
  
  const fetchHospitalsFromDatabase = async () => {
    try {
      setDbLoading(true);
      const response = await fetch('http://localhost:3000/api/hospitals');
      if (!response.ok) throw new Error('Failed to fetch hospitals from database');
      const data = await response.json();
      setDbHospitals(data);
    } catch (error) {
      console.error('Error fetching hospitals from database:', error);
    } finally {
      setDbLoading(false);
    }
  };
  useEffect(() => {
    // Get user's current location on initial load
    handleGetLocation();
  }, []);
  
  useEffect(() => {
    // Fetch places whenever location or search parameters change
    if (userLocation && isLoaded) {
      fetchNearbyPlaces();
    }
  }, [userLocation, selectedType, distance, isLoaded]);
  
  const handleGetLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
          alert("Failed to get your location. Please enable location services.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };
  
  const fetchNearbyPlaces = async () => {
    try {
      setLoading(true);
      console.log("Fetching nearby places for:", userLocation);
      
      // API call to fetch nearby places
      const response = await fetch(
        `http://localhost:3000/api/places/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${distance[0]}&type=${selectedType}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch places');
      }
      
      const data = await response.json();
      console.log("API response data:", data);
      
      // Set places directly from API response
      setPlaces(data.results || []);
      console.log("Places set:", data.results);
      
      // IMPORTANT: Do not use mockData here
      // The following line should be removed or commented out
      // setPlaces(mockData.results);
      
    } catch (error) {
      console.error('Error fetching places:', error);
      alert('Failed to fetch nearby places.');
      
      // If API fails, you might want to use mock data as a fallback for development
      console.log("Using mock data as fallback");
      const mockData = {
        results: [
          {
            place_id: "1",
            name: "City General Hospital",
            vicinity: "123 Main Street, Cityville",
            geometry: {
              location: {
                lat: userLocation.lat + 0.01,
                lng: userLocation.lng + 0.01
              }
            },
            rating: 4.2,
            opening_hours: { open_now: true },
            types: ["hospital", "health", "point_of_interest"]
          },
          {
            place_id: "2",
            name: "Westside Medical Center",
            vicinity: "456 Oak Avenue, Cityville",
            geometry: {
              location: {
                lat: userLocation.lat - 0.01,
                lng: userLocation.lng + 0.01
              }
            },
            rating: 4.7,
            opening_hours: { open_now: true },
            types: ["hospital", "health", "point_of_interest"]
          },
          {
            place_id: "3",
            name: "Eastside Emergency Care",
            vicinity: "789 Pine Road, Cityville",
            geometry: {
              location: {
                lat: userLocation.lat + 0.01,
                lng: userLocation.lng - 0.01
              }
            },
            rating: 3.9,
            opening_hours: { open_now: false },
            types: ["hospital", "health", "point_of_interest"]
          }
        ]
      };
      setPlaces(mockData.results);
    } finally {
      setLoading(false);
    }
  };
  
  // Format places data for list view
  const formatPlacesForList = () => {
    if (!places || places.length === 0) return [];
    
    return places.map(place => {
      // Ensure place has the required properties
      if (!place.geometry || !place.geometry.location) {
        console.warn("Place is missing geometry or location:", place);
        return null;
      }
      
      return {
        id: place.place_id,
        name: place.name,
        type: selectedType === 'Pharmacy' ? 'Pharmacy' : 'Medical shop',
        distance: calculateDistance(
          userLocation.lat, 
          userLocation.lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        ),
        address: place.vicinity,
        phone: place.formatted_phone_number || 'N/A',
        rating: place.rating || 'N/A',
        waitTime: '~15 min', // This would need real data from a separate API
        specialties: place.types || [],
        isOpen: place.opening_hours?.open_now || false,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        }
      };
    }).filter(Boolean); // Remove null entries
  };
  
  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(1) + ' miles';
  };
  
  // Filter facilities based on search query
  const filteredFacilities = places.length > 0 
    ? formatPlacesForList().filter(facility => {
        if (!facility) return false;
        if (searchQuery && !facility.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        return true;
      })
    : [];



// Filter database hospitals based on search query
const filteredDbHospitals = dbHospitals.filter(hospital => {
  if (searchQuery && !hospital.name.toLowerCase().includes(searchQuery.toLowerCase())) {
    return false;
  }
  return true;
});
  
  const onMapLoad = (map) => {
    console.log("Map loaded");
    setMapInstance(map);
  };
  
  const renderMap = () => {
    console.log("Rendering map with places:", places);
    
    if (!isLoaded) return <div>Loading maps...</div>;
    
    if (!window.google) {
      console.error("Google Maps API not loaded");
      return <div>Error loading Google Maps API</div>;
    }
    
    return (
      <GoogleMap
        mapContainerStyle={{ height: '600px', width: '100%' }}
        center={userLocation}
        zoom={13}
        onLoad={onMapLoad}
      >
        {/* User Location Marker */}
        <Marker
          position={userLocation}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#FF0000',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF'
          }}
          title="Your Location"
        />
        
        {/* Hospital/Facility Markers */}
        {places.map((place) => {
          console.log("Rendering marker for:", place.name, place.geometry?.location);
          
          // Verify place has valid geometry
          if (place.geometry && place.geometry.location && 
              typeof place.geometry.location.lat === 'number' && 
              typeof place.geometry.location.lng === 'number') {
            return (
              <Marker
                key={place.place_id}
                position={{
                  lat: place.geometry.location.lat,
                  lng: place.geometry.location.lng
                }}
                // Using default marker temporarily to debug
                // icon={{
                //   path: window.google.maps.SymbolPath.CIRCLE,
                //   scale: 8,
                //   fillColor: '#0000FF',
                //   fillOpacity: 1,
                //   strokeWeight: 2,
                //   strokeColor: '#FFFFFF'
                // }}
                onClick={() => setSelectedPlace(place)}
              />
            );
          }
          console.warn("Invalid place geometry:", place);
          return null;
        })}
        
        {/* Info Window for selected place */}
        {selectedPlace && (
          <InfoWindow
            position={{
              lat: selectedPlace.geometry.location.lat,
              lng: selectedPlace.geometry.location.lng
            }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold text-base">{selectedPlace.name}</h3>
              <p className="text-sm mt-1">{selectedPlace.vicinity}</p>
              {selectedPlace.rating && (
                <p className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                  <span className="text-sm">{selectedPlace.rating}</span>
                </p>
              )}
              {selectedPlace.opening_hours && (
                <p className="text-xs mt-1">
                  {selectedPlace.opening_hours.open_now ? 
                    <span className="text-green-600">Open now</span> : 
                    <span className="text-red-600">Closed</span>
                  }
                </p>
              )}
              <Button 
                className="mt-2 w-full text-xs py-1 h-8"
                size="sm"
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedPlace.geometry.location.lat},${selectedPlace.geometry.location.lng}`,
                    '_blank'
                  );
                }}
              >
                <MapPin className="h-3 w-3 mr-1" /> Get Directions
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    );
  };

  return (

    <Card className="border-none shadow-md overflow-hidden">
      <CardContent className="p-0">
        {!userLocation ? (
          <div className="bg-blue-50 h-96 flex items-center justify-center">
            <div className="text-center p-4">
              {loading ? (
                <div className="flex flex-col items-center">
                  <Loader className="h-10 w-10 text-blue-400 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Loading map data...</p>
                </div>
              ) : (
                <>
                  <MapPin className="h-10 w-10 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-3">Please enable location services to view the map</p>
                  <Button onClick={handleGetLocation}>Get My Location</Button>
                </>
              )}
            </div>
          </div>
        ) : (
          renderMap()
        )}
      </CardContent>
    </Card>

  );
};

export default PharmacyLocator;