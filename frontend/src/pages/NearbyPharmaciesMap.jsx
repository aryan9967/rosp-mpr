import { useState, useEffect } from 'react';
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const NearbyPharmaciesMap = ({ userLocation, dynamicPharmacies }) => {
    const [selectedPlace, setSelectedPlace] = useState(null);

    // Load Google Maps API
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyC5pnj_yE8KEUThBlHUFP6dNwlDj2EiU5Y', // Replace with your API key
        libraries: ['places'],
    });

    // Render the map
    if (!isLoaded) {
        return <div>Loading map...</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={{ height: '400px', width: '100%' }}
            center={userLocation}
            zoom={14}
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
                    strokeColor: '#FFFFFF',
                }}
                title="Your Location"
            />

            {/* Pharmacy Markers */}
            {dynamicPharmacies.map((pharmacy) => (
                <Marker
                    key={pharmacy.place_id}
                    position={{
                        lat: pharmacy.geometry.location.lat,
                        lng: pharmacy.geometry.location.lng,
                    }}
                    onClick={() => setSelectedPlace(pharmacy)}
                />
            ))}

            {/* Info Window for Selected Pharmacy */}
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
                                <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
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

export default NearbyPharmaciesMap;