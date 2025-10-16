import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, AlertCircle, CheckCircle, XCircle, Filter, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNavigate } from "react-router-dom";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MedicineOrderPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [apiMedicines, setApiMedicines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [showOrderDialog, setShowOrderDialog] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [showMap, setShowMap] = useState(false);
    const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [googleMapLoaded, setGoogleMapLoaded] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [expandedFilters, setExpandedFilters] = useState(true);

    // Filter states
    const [filters, setFilters] = useState({
        priceRange: [0, 500],
        inStock: true,
        categories: [],
        sortBy: 'relevance'
    });
    const navigate = useNavigate(); // ✅ No 'new' keyword

    // Local pharmacy medicines
    const localPharmacyMedicines = [
        {
            id: 'local-1',
            name: 'Paracetamol',
            price: 45.00,
            mrp: 50.00,
            discount: 10,
            manufacturer: 'Local Pharmacy',
            in_stock: 2,
            categories: ['Pain relief', 'Fever'],
            image_url: '/api/placeholder/100/100',
            local: true,
            pharmacy: 'City Medical Store',
            location: { lat: 12.9716, lng: 77.5946 } // Example coordinates
        },
        {
            id: 'local-2',
            name: 'Azithromycin',
            price: 120.00,
            mrp: 150.00,
            discount: 20,
            manufacturer: 'Local Pharmacy',
            in_stock: 0,
            categories: ['Antibiotic'],
            image_url: '/api/placeholder/100/100',
            local: true,
            pharmacy: 'Health First Pharmacy',
            location: { lat: 12.9766, lng: 77.5993 } // Example coordinates
        },
        {
            id: 'local-3',
            name: 'Cetrizine',
            price: 35.00,
            mrp: 40.00,
            discount: 12.5,
            manufacturer: 'Local Pharmacy',
            in_stock: 10,
            categories: ['Allergy'],
            image_url: '/api/placeholder/100/100',
            local: true,
            pharmacy: 'Wellness Pharmacy',
            location: { lat: 12.9641, lng: 77.6057 } // Example coordinates
        },
        {
            id: 'local-4',
            name: 'Vitamin',
            price: 180.00,
            mrp: 200.00,
            discount: 10,
            manufacturer: 'Local Pharmacy',
            in_stock: 5,
            categories: ['Vitamins & Supplements'],
            image_url: '/api/placeholder/100/100',
            local: true,
            pharmacy: 'MediPlus Pharmacy',
            location: { lat: 12.9592, lng: 77.6974 } // Example coordinates
        },
        {
            id: 'local-5',
            name: 'Ibuprofen',
            price: 60.00,
            mrp: 70.00,
            discount: 14.3,
            manufacturer: 'Local Pharmacy',
            in_stock: 1,
            categories: ['Pain relief', 'Anti-inflammatory'],
            image_url: '/api/placeholder/100/100',
            local: true,
            pharmacy: 'City Medical Store',
            location: { lat: 12.9716, lng: 77.5946 } // Example coordinates
        },
        {
            id: 'local-6',
            name: 'Multivitamin Tablet',
            price: 250.00,
            mrp: 300.00,
            discount: 16.7,
            manufacturer: 'Local Pharmacy',
            in_stock: 3,
            categories: ['Vitamins & Supplements'],
            image_url: '/api/placeholder/100/100',
            local: true,
            pharmacy: 'Health First Pharmacy',
            location: { lat: 12.9766, lng: 77.5993 } // Example coordinates
        }
    ];
    const [dynamicPharmacies, setDynamicPharmacies] = useState([]);

    // Extract unique categories
    const allCategories = [...new Set(localPharmacyMedicines.flatMap(med => med.categories))];

    const fetchMedicines = async () => {
        if (!searchQuery.trim()) {
            setApiMedicines([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: searchQuery }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch medicines');
            }
            const data = await response.json();
            setApiMedicines(data);
        } catch (error) {
            console.error('Error fetching medicines:', error);
            setApiMedicines([]);
        } finally {
            setIsLoading(false);
        }
    };

    const loadGoogleMapsScript = () => {
        if (!googleMapLoaded && !document.getElementById('google-maps-script')) {
            const script = document.createElement('script');
            script.id = 'google-maps-script';

            // Make sure to use a valid API key with Places API enabled
            const apiKey = import.meta.env.VITE_GOOGLE_MAP_KEY; // Replace with your actual API key
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log('Google Maps script loaded successfully');
                setGoogleMapLoaded(true);
            };
            script.onerror = (error) => {
                console.error('Error loading Google Maps script:', error);
            };
            document.head.appendChild(script);
        }
    };

    const findNearbyPharmacies = (location) => {
        if (!window.google || !window.google.maps || !window.google.maps.places) {
            console.error("Google Maps Places API not loaded");
            return;
        }

        console.log("Searching for pharmacies near:", location);

        // Create a map element for the PlacesService to use
        // PlacesService needs a Map instance or a DOM element that's in the document
        let mapDiv;

        // Try to use existing map div if it exists
        const existingMapDiv = document.getElementById('pharmacy-map') || document.getElementById('pharmacy-map-desktop');

        if (existingMapDiv) {
            mapDiv = existingMapDiv;
        } else {
            // If no map divs exist yet, create a hidden map div
            mapDiv = document.createElement('div');
            mapDiv.style.display = 'none';
            document.body.appendChild(mapDiv);
        }

        // Create a temporary map for the service
        const tempMap = new window.google.maps.Map(mapDiv, {
            center: location,
            zoom: 15
        });

        const service = new window.google.maps.places.PlacesService(tempMap);

        const request = {
            location: location,
            radius: 1500, // Search within 1.5km
            type: ['pharmacy']
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                console.log("Found pharmacies:", results);

                const pharmacies = results.map(place => ({
                    name: place.name,
                    location: {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    },
                    address: place.vicinity,
                    placeId: place.place_id,
                    rating: place.rating,
                    openNow: place.opening_hours ? place.opening_hours.open_now : null
                }));

                setDynamicPharmacies(pharmacies);

                // Initialize maps after pharmacies are loaded
                setTimeout(initializeMaps, 100);
            } else {
                console.error("Places API returned status:", status);
            }
        });
    };

    const initializeMaps = () => {
        if (!googleMapLoaded || !userLocation) {
            console.log("Google Maps not loaded or user location not available");
            return;
        }

        // Get map elements
        const mobileMapElement = document.getElementById('pharmacy-map');
        const desktopMapElement = document.getElementById('pharmacy-map-desktop');

        // Initialize maps if elements exist
        if (mobileMapElement) {
            const mobileMap = new window.google.maps.Map(mobileMapElement, {
                center: userLocation,
                zoom: 14
            });

            // Add user marker
            new window.google.maps.Marker({
                position: userLocation,
                map: mobileMap,
                title: "Your Location",
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2
                }
            });

            // Add pharmacy markers
            dynamicPharmacies.forEach(pharmacy => {
                const marker = new window.google.maps.Marker({
                    position: pharmacy.location,
                    map: mobileMap,
                    title: pharmacy.name
                });

                // Optional: Add click listener for more details
                marker.addListener('click', () => {
                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `<div><strong>${pharmacy.name}</strong><p>${pharmacy.address}</p></div>`
                    });
                    infoWindow.open(mobileMap, marker);
                });
            });
        }

        if (desktopMapElement) {
            const desktopMap = new window.google.maps.Map(desktopMapElement, {
                center: userLocation,
                zoom: 14
            });

            // Add user marker
            new window.google.maps.Marker({
                position: userLocation,
                map: desktopMap,
                title: "Your Location",
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2
                }
            });

            // Add pharmacy markers
            dynamicPharmacies.forEach(pharmacy => {
                const marker = new window.google.maps.Marker({
                    position: pharmacy.location,
                    map: desktopMap,
                    title: pharmacy.name
                });

                // Optional: Add click listener for more details
                marker.addListener('click', () => {
                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `<div><strong>${pharmacy.name}</strong><p>${pharmacy.address}</p></div>`
                    });
                    infoWindow.open(desktopMap, marker);
                });
            });
        }

        setMapInstance({ mobile: mobileMapElement, desktop: desktopMapElement });
    };

    useEffect(() => {
        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLoc = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    console.log('User location obtained:', userLoc);
                    setUserLocation(userLoc);

                    // Wait for Google Maps API to be loaded before finding pharmacies
                    if (googleMapLoaded) {
                        findNearbyPharmacies(userLoc);
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Default location if user denies permission
                    const defaultLoc = { lat: 12.9716, lng: 77.5946 }; // Example coordinates
                    setUserLocation(defaultLoc);

                    if (googleMapLoaded) {
                        findNearbyPharmacies(defaultLoc);
                    }
                }
            );
        }

        loadGoogleMapsScript();
    }, [googleMapLoaded]);

    // Add a separate useEffect to trigger findNearbyPharmacies when Google Maps loads
    // (in case maps loads after we already have the location)
    useEffect(() => {
        if (googleMapLoaded && userLocation) {
            findNearbyPharmacies(userLocation);
        }
    }, [googleMapLoaded, userLocation]);

    useEffect(() => {
        if (googleMapLoaded && userLocation && dynamicPharmacies.length > 0) {
            initializeMaps();
        }
    }, [googleMapLoaded, userLocation, dynamicPharmacies]);

    // Filter local medicines based on filters
    const applyFilters = (medicines) => {
        return medicines.filter(medicine => {
            // Filter by price range
            const priceInRange = medicine.price >= filters.priceRange[0] && medicine.price <= filters.priceRange[1];

            // Filter by in-stock status
            const stockFilter = filters.inStock ? medicine.in_stock > 0 : true;

            // Filter by categories
            const categoryFilter = filters.categories.length === 0 ||
                medicine.categories.some(category => filters.categories.includes(category));

            return priceInRange && stockFilter && categoryFilter;
        });
    };

    // Sort medicines
    const sortMedicines = (medicines) => {
        switch (filters.sortBy) {
            case 'priceLow':
                return [...medicines].sort((a, b) => a.price - b.price);
            case 'priceHigh':
                return [...medicines].sort((a, b) => b.price - a.price);
            case 'discount':
                return [...medicines].sort((a, b) => b.discount - a.discount);
            case 'availability':
                return [...medicines].sort((a, b) => b.in_stock - a.in_stock);
            default:
                return medicines; // relevance or default
        }
    };

    // Filter local medicines based on search query
    const filteredLocalMedicines = localPharmacyMedicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Combined results
    const allMedicines = [...apiMedicines, ...filteredLocalMedicines];

    // Filtered and sorted results based on active tab and filters
    const getDisplayedMedicines = () => {
        let medicines = activeTab === 'all'
            ? allMedicines
            : activeTab === 'online'
                ? apiMedicines
                : filteredLocalMedicines;

        medicines = applyFilters(medicines);
        return sortMedicines(medicines);
    };

    const displayedMedicines = getDisplayedMedicines();

    const addToCart = (medicine) => {
        const existingItem = cart.find(item => item.id === medicine.id);

        if (existingItem) {
            // Update quantity if already in cart
            setCart(cart.map(item =>
                item.id === medicine.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            // Add new item to cart
            setCart([...cart, { ...medicine, quantity: 1 }]);
        }
    };

    const removeFromCart = (medicineId) => {
        setCart(cart.filter(item => item.id !== medicineId));
    };

    const updateCartItemQuantity = (medicineId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(medicineId);
            return;
        }

        setCart(cart.map(item =>
            item.id === medicineId
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const openOrderDialog = (medicine) => {
        setSelectedMedicine(medicine);
        setShowOrderDialog(true);
    };

    const getStockStatusColor = (inStock) => {
        if (inStock === 0) return 'bg-red-100 text-red-800';
        if (inStock <= 2) return 'bg-amber-100 text-amber-800';
        return 'bg-green-100 text-green-800';
    };

    const getStockStatusIcon = (inStock) => {
        if (inStock === 0) return <XCircle className="h-4 w-4 text-red-600" />;
        if (inStock <= 2) return <AlertCircle className="h-4 w-4 text-amber-600" />;
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    };

    const getStockStatusText = (inStock) => {
        if (inStock === 0) return 'Out of Stock';
        if (inStock <= 2) return `Low Stock (${inStock})`;
        return `In Stock (${inStock})`;
    };

    const toggleCategory = (category) => {
        if (filters.categories.includes(category)) {
            setFilters({
                ...filters,
                categories: filters.categories.filter(c => c !== category)
            });
        } else {
            setFilters({
                ...filters,
                categories: [...filters.categories, category]
            });
        }
    };

    const resetFilters = () => {
        setFilters({
            priceRange: [0, 500],
            inStock: true,
            categories: [],
            sortBy: 'relevance'
        });
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto py-8 px-4">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6 mb-8 shadow-md">
                    <h1 className="text-3xl font-bold mb-2 text-blue-800">Emergency Medicine Order</h1>
                    <p className="text-gray-600 mb-4">Find and order medicines from online and local pharmacies</p>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Search for medicines..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 shadow-sm border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
                            </div>
                        </div>
                        <Button
                            onClick={fetchMedicines}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 transition duration-200"
                        >
                            {isLoading ? 'Searching...' : 'Search'}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar with filters */}
                    <div className="lg:w-1/4">
                        <Card className="sticky top-4">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg font-bold flex items-center">
                                        <Filter className="h-5 w-5 mr-2" /> Filters
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={() => setExpandedFilters(!expandedFilters)}>
                                        {expandedFilters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </CardHeader>

                            {expandedFilters && (
                                <CardContent className="space-y-6">
                                    {/* Price Range */}
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-sm">Price Range</h3>
                                        <div className="pt-2">
                                            <Slider
                                                min={0}
                                                max={500}
                                                step={10}
                                                value={filters.priceRange}
                                                onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                                                className="py-2"
                                            />
                                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                                                <span>₹{filters.priceRange[0]}</span>
                                                <span>₹{filters.priceRange[1]}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Stock Filter */}
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="in-stock" className="font-medium text-sm">Show only in-stock items</Label>
                                        <Switch
                                            id="in-stock"
                                            checked={filters.inStock}
                                            onCheckedChange={(checked) => setFilters({ ...filters, inStock: checked })}
                                        />
                                    </div>

                                    <Separator />

                                    {/* Categories */}
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-sm">Categories</h3>
                                        <div className="space-y-1.5">
                                            {allCategories.map((category) => (
                                                <div key={category} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`category-${category}`}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-400 mr-2"
                                                        checked={filters.categories.includes(category)}
                                                        onChange={() => toggleCategory(category)}
                                                    />
                                                    <label htmlFor={`category-${category}`} className="text-sm">{category}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Sort By */}
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-sm">Sort By</h3>
                                        <select
                                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                            value={filters.sortBy}
                                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                        >
                                            <option value="relevance">Relevance</option>
                                            <option value="priceLow">Price: Low to High</option>
                                            <option value="priceHigh">Price: High to Low</option>
                                            <option value="discount">Highest Discount</option>
                                            <option value="availability">Availability</option>
                                        </select>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={resetFilters}
                                    >
                                        Reset Filters
                                    </Button>
                                </CardContent>
                            )}
                        </Card>

                        {/* Map Toggle Button (Mobile) */}
                        <div className="mt-4 lg:hidden">
                            <Button
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => setShowMap(!showMap)}
                                variant={showMap ? "default" : "outline"}
                            >
                                <MapPin className="h-4 w-4" />
                                {showMap ? "Hide Map" : "Show Nearby Pharmacies"}
                            </Button>
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="flex-1">
                        {showMap && (
                            <div className="mb-6 rounded-lg overflow-hidden shadow-md lg:hidden h-64 bg-gray-100">
                                <div id="pharmacy-map" className="w-full h-full"></div>
                            </div>
                        )}

                        {/* Tabs */}
                        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="online">Online</TabsTrigger>
                                <TabsTrigger value="local">Local Pharmacy</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Results stats */}
                        <div className="mb-4 flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Showing {displayedMedicines.length} results
                                {filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ?
                                    ` • Price: ₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}` :
                                    ''}
                                {filters.inStock ? ' • In Stock Only' : ''}
                                {filters.categories.length > 0 ? ` • ${filters.categories.length} categories selected` : ''}
                            </p>
                        </div>

                        {/* Medicine Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {displayedMedicines.length > 0 ? (
                                displayedMedicines.map((medicine) => (
                                    <Card key={medicine.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition duration-200">
                                        <CardHeader className="pb-2 bg-gradient-to-r from-white to-gray-50">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg font-bold">{medicine.name}</CardTitle>
                                                {medicine.local && (
                                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                                        Local
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {getStockStatusIcon(medicine.in_stock)}
                                                <span className={`text-sm px-2 py-0.5 rounded-full ${getStockStatusColor(medicine.in_stock)}`}>
                                                    {getStockStatusText(medicine.in_stock)}
                                                </span>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center shadow">
                                                    <img
                                                        src={`https://www.netmeds.com/${medicine.image_url}`}
                                                        alt={medicine.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-lg">₹{medicine.price.toFixed(2)}</span>
                                                        <span className="text-gray-500 line-through text-sm">₹{medicine.mrp.toFixed(2)}</span>
                                                        <Badge className="bg-green-50 text-green-700 border-green-100">
                                                            {medicine.discount}% off
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{medicine.manufacturer}</p>
                                                    {medicine.local && (
                                                        <p className="text-sm font-medium text-blue-600 mt-1 flex items-center">
                                                            <MapPin className="h-3 w-3 mr-1" /> {medicine.pharmacy}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {medicine.categories.map((category, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {category}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>

                                        <CardFooter className="flex justify-center pt-2 bg-gray-50">

                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    if (medicine.url) {
                                                        window.open(medicine.url, "_blank");
                                                    }
                                                }}
                                                disabled={medicine.in_stock === 0}
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                Order Now
                                            </Button>

                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                                    <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">
                                        {searchQuery.trim()
                                            ? 'No medicines found. Try a different search term or adjust your filters.'
                                            : 'Search for medicines to see results.'
                                        }
                                    </p>
                                    {(filters.priceRange[0] > 0 || filters.priceRange[1] < 500 || filters.inStock || filters.categories.length > 0) && (
                                        <Button
                                            variant="outline"
                                            className="mt-4"
                                            onClick={resetFilters}
                                        >
                                            Reset Filters
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map sidebar (Desktop) */}
                    <div className="hidden lg:block lg:w-1/4">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle onClick={() => { navigate('/pharmacy-locator') }} className="text-lg font-bold flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" /> Nearby Pharmacies
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="h-64 bg-gray-100">
                                    <div id="pharmacy-map-desktop" className="w-full h-full"></div>
                                </div>
                                {/* Update the pharmacy list UI */}
                                <ul className="divide-y">
                                    {dynamicPharmacies.length > 0 ? (
                                        dynamicPharmacies.map((pharmacy, index) => (
                                            <li key={index} className="p-3 hover:bg-gray-50">
                                                <h4 className="font-medium">{pharmacy.name}</h4>
                                                <p className="text-sm text-gray-500">{pharmacy.address}</p>
                                                {pharmacy.rating && (
                                                    <p className="text-sm text-amber-600">{pharmacy.rating} ⭐</p>
                                                )}
                                                {pharmacy.openNow !== null && (
                                                    <p className="text-sm mt-1">
                                                        <span className={pharmacy.openNow ? "text-green-600" : "text-red-600"}>
                                                            {pharmacy.openNow ? "Open now" : "Closed"}
                                                        </span>
                                                    </p>
                                                )}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="p-3 text-center text-gray-500">
                                            {googleMapLoaded ? "No pharmacies found nearby" : "Loading pharmacies..."}
                                        </li>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Floating Cart Button (Mobile) */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg flex items-center justify-center md:hidden"
                            style={{ zIndex: 50 }}
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-96">
                        <SheetHeader>
                            <SheetTitle>Your Cart ({cart.length})</SheetTitle>
                        </SheetHeader>
                        {cart.length > 0 ? (
                            <>
                                <div className="mt-4 flex-1 overflow-y-auto">
                                    {cart.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-2">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <div className="flex items-center mt-1">
                                                    <button
                                                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                                                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                                    >-</button>
                                                    <span className="mx-2">{item.quantity}</span>
                                                    <button
                                                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                                                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                                    >+</button>
                                                    <span className="ml-4">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t mt-4 py-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold">Total:</h4>
                                        <span className="font-bold text-lg">
                                            ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <Button className="w-full">Checkout</Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <ShoppingCart className="h-12 w-12 text-gray-300 mb-2" />
                                <p className="text-gray-500">Your cart is empty</p>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>

            </div>
            <Footer />
        </>
    );
};

export default MedicineOrderPage;