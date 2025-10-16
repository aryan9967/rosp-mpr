import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Phone,
  Star,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  Users,
  Loader,
} from "lucide-react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import { useUser } from "@clerk/clerk-react";
import Footer from "@/components/Footer";

const HospitalLocator = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [distance, setDistance] = useState([5000]);
  const [selectedType, setSelectedType] = useState("hospital");
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [databaseHospitals, setDatabaseHospitals] = useState([]);
  
  // Google Maps API loader
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC5pnj_yE8KEUThBlHUFP6dNwlDj2EiU5Y", // Replace with your actual API key
  });

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
          alert(
            "Failed to get your location. Please enable location services."
          );
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
        throw new Error("Failed to fetch places");
      }

      const data = await response.json();
      console.log("API response data:", data);

      // Set places directly from API response
      setPlaces(data.results || []);
      console.log("Places set:", data.results);
    } catch (error) {
      console.error("Error fetching places:", error);
      alert("Failed to fetch nearby places.");

      // If API fails, use mock data as a fallback for development
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
                lng: userLocation.lng + 0.01,
              },
            },
            rating: 4.2,
            opening_hours: { open_now: true },
            types: ["hospital", "health", "point_of_interest"],
          },
          {
            place_id: "2",
            name: "Westside Medical Center",
            vicinity: "456 Oak Avenue, Cityville",
            geometry: {
              location: {
                lat: userLocation.lat - 0.01,
                lng: userLocation.lng + 0.01,
              },
            },
            rating: 4.7,
            opening_hours: { open_now: true },
            types: ["hospital", "health", "point_of_interest"],
          },
          {
            place_id: "3",
            name: "Eastside Emergency Care",
            vicinity: "789 Pine Road, Cityville",
            geometry: {
              location: {
                lat: userLocation.lat + 0.01,
                lng: userLocation.lng - 0.01,
              },
            },
            rating: 3.9,
            opening_hours: { open_now: false },
            types: ["hospital", "health", "point_of_interest"],
          },
        ],
      };
      setPlaces(mockData.results);
    } finally {
      setLoading(false);
    }
  };

    // Fetch database hospitals on component mount
    useEffect(() => {
      const fetchDatabaseHospitals = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/hospitals');
          if (!response.ok) throw new Error('Failed to fetch hospitals');
          const data = await response.json();
          setDatabaseHospitals(data);
        } catch (error) {
          console.error('Error fetching database hospitals:', error);
        }
      };
  
      fetchDatabaseHospitals();
    }, []);
  
  // Format places data for list view
  const formatPlacesForList = () => {
    if (!places || places.length === 0) return [];

    return places
      .map((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.warn("Place is missing geometry or location:", place);
          return null;
        }

        return {
          id: place.place_id,
          name: place.name,
          type: selectedType === "hospital" ? "Hospital" : "Fire Brigade",
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            place.geometry.location.lat,
            place.geometry.location.lng
          ),
          address: place.vicinity,
          phone: place.formatted_phone_number || "N/A",
          rating: place.rating || "N/A",
          waitTime: "~15 min", // This would need real data from a separate API
          specialties: place.types || [],
          isOpen: place.opening_hours?.open_now || false,
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
        };
      })
      .filter(Boolean); // Remove null entries
  };

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(1) + " miles";
  };

  // Filter facilities based on search query
  const filteredFacilities =
    places.length > 0
      ? formatPlacesForList().filter((facility) => {
          if (!facility) return false;
          if (
            searchQuery &&
            !facility.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            return false;
          }
          return true;
        })
      : [];

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
        mapContainerStyle={{ height: "600px", width: "100%" }}
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
            fillColor: "#FF0000",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          }}
          title="Your Location"
        />

        {/* Hospital/Facility Markers */}
        {places.map((place) => {
          console.log(
            "Rendering marker for:",
            place.name,
            place.geometry?.location
          );

          if (
            place.geometry &&
            place.geometry.location &&
            typeof place.geometry.location.lat === "number" &&
            typeof place.geometry.location.lng === "number"
          ) {
            return (
              <Marker
                key={place.place_id}
                position={{
                  lat: place.geometry.location.lat,
                  lng: place.geometry.location.lng,
                }}
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
              lng: selectedPlace.geometry.location.lng,
            }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold text-base">{selectedPlace.name}</h3>
              <p className="text-sm mt-1">{selectedPlace.vicinity}</p>
              {selectedPlace.rating && (
                <p className="flex items-center mt-1">
                  <Star
                    className="h-3 w-3 text-yellow-500 mr-1"
                    fill="currentColor"
                  />
                  <span className="text-sm">{selectedPlace.rating}</span>
                </p>
              )}
              {selectedPlace.opening_hours && (
                <p className="text-xs mt-1">
                  {selectedPlace.opening_hours.open_now ? (
                    <span className="text-green-600">Open now</span>
                  ) : (
                    <span className="text-red-600">Closed</span>
                  )}
                </p>
              )}
              <Button
                className="mt-2 w-full text-xs py-1 h-8"
                size="sm"
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedPlace.geometry.location.lat},${selectedPlace.geometry.location.lng}`,
                    "_blank"
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
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-red-50 p-4">
        <div className="max-w-4xl mx-auto pt-6 pb-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              Emergency Services Locator
            </h1>
            <p className="text-gray-600 mt-2">
              Find the nearest hospitals and emergency services
            </p>
          </motion.div>

          {/* Search and Filters */}
          <Card className="border-none shadow-md mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search facilities..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {showFilters ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Facility Type
                      </label>
                      <Select
                        value={selectedType}
                        onValueChange={setSelectedType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hospital">Hospitals</SelectItem>
                          <SelectItem value="fire_station">Fire Brigades</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                          
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Distance: {Math.round(distance[0] / 1000)} km
                      </label>
                      <Slider
                        defaultValue={[5000]}
                        min={1000}
                        max={50000}
                        step={1000}
                        value={distance}
                        onValueChange={setDistance}
                        className="py-4"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Sort By
                      </label>
                      <Select defaultValue="distance">
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="distance">Distance</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={handleGetLocation}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      {loading ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      Get My Location
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* View Modes */}
          <Tabs defaultValue="list" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              
            </TabsList>
            <TabsContent value="database" className="mt-4">
              <div className="space-y-4">
                {databaseHospitals.length > 0 ? (
                  databaseHospitals.map((hospital, index) => (
                    <motion.div
                      key={hospital._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg">{hospital.name}</h3>
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">
                              <strong>Emergency Beds:</strong> {hospital.beds.emergency}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>ICU Beds:</strong> {hospital.beds.icu}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>General Ward:</strong> {hospital.beds.general}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Active Services:</strong> {hospital.services.join(', ')}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hospitals found in the database.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="list" className="mt-4">
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <Loader className="h-8 w-8 text-blue-500 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-500">Loading facilities...</p>
                  </div>
                ) : filteredFacilities.length > 0 ? (
                  filteredFacilities.map((facility, index) => (
                    <motion.div
                      key={facility.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-0">
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {facility.name}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="font-normal"
                                  >
                                    {facility.type}
                                  </Badge>
                                  <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {facility.distance}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                {facility.rating !== "N/A" && (
                                  <div className="flex items-center mb-1">
                                    <Star
                                      className="h-4 w-4 text-yellow-500 mr-1"
                                      fill="currentColor"
                                    />
                                    <span className="font-medium">
                                      {facility.rating}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center text-sm">
                                  <Clock className="h-3 w-3 mr-1 text-blue-500" />
                                  <span className="text-blue-700 font-medium">
                                    {facility.waitTime}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3">
                              {facility.specialties &&
                                facility.specialties.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {facility.specialties
                                      .slice(0, 3)
                                      .map((specialty, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                        >
                                          {specialty.split("_").join(" ")}
                                        </Badge>
                                      ))}
                                  </div>
                                )}

                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <MapPin className="h-3 w-3 mr-1" />
                                {facility.address}
                              </div>
                            </div>
                          </div>

                          <div className="flex border-t border-gray-100">
                            <Button
                              variant="ghost"
                              className="flex-1 rounded-none py-3 h-auto text-blue-600"
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                            <div className="w-px bg-gray-100"></div>
                            <Button
                              variant="ghost"
                              className="flex-1 rounded-none py-3 h-auto text-blue-600"
                              onClick={() => {
                                window.open(
                                  `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${facility.location.lat},${facility.location.lng}`,
                                  "_blank"
                                );
                              }}
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              Directions
                            </Button>
                            <div className="w-px bg-gray-100"></div>
                            <Button
                              variant="ghost"
                              className="flex-1 rounded-none py-3 h-auto text-blue-600"
                            >
                              <Users className="h-4 w-4 mr-2" />
                              Wait List
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No facilities found matching your criteria.
                    </p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery("");
                      }}
                    >
                      Reset filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="map" className="mt-4">
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
                            <p className="text-gray-600 mb-3">
                              Please enable location services to view the map
                            </p>
                            <Button onClick={handleGetLocation}>
                              Get My Location
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    renderMap()
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
              
        {/* <Chatbot /> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HospitalLocator;
