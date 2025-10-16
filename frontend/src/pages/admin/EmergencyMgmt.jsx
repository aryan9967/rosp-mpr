import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  Ambulance, 
  CalendarClock, 
  FileText,
  Heart,
  Droplets,
  // Lungs
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminNavbar from '@/components/AdminNavbar';

const EmergencyMgmt = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [displayMode, setDisplayMode] = useState('active');
  const [emergencyCases, setEmergencyCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaseDetails, setSelectedCaseDetails] = useState(null);
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Fetch all emergencies
  useEffect(() => {
    const fetchEmergencyCases = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/all-emergency');
        const data = await response.json();
        
        // Transform API data to match our component's expected format
        const formattedData = data.map(emergency => ({
          id: emergency.emergencyId,
          patient: emergency.name,
          location: emergency.location,
          type: emergency.cause,
          time: formatTimeDifference(emergency.date),
          severity: emergency.priority,
          status: emergency.status === "pending" ? "Active" : "Resolved",
          lat: emergency.lat,
          long: emergency.long,
          details: {
            heartRate: emergency.heartRate,
            bloodPressure: emergency.bloodPressure,
            oxygenSaturation: emergency.Spo2,
            userId: emergency.userId
          }
        }));
        
        setEmergencyCases(formattedData);
      } catch (error) {
        console.error("Error fetching emergency cases:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmergencyCases();
    
    // Set up polling every 30 seconds to keep data fresh
    const intervalId = setInterval(fetchEmergencyCases, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Fetch detailed emergency info when a case is selected
  useEffect(() => {
    if (selectedCase) {
      const fetchCaseDetails = async () => {
        try {
          const response = await fetch(`http://localhost:3000/get-emergency-data/${selectedCase.id}`);
          const detailData = await response.json();
          
          // Merge the detailed data with the selected case
          setSelectedCaseDetails({
            ...selectedCase,
            details: {
              ...selectedCase.details,
              age: detailData.user?.age || "N/A",
              gender: "N/A", // Not provided in API
              contact: detailData.user?.phone || "N/A",
              medicalHistory: detailData.user?.diseases?.join(", ") || "No known conditions",
              bloodGroup: detailData.user?.bloodGroup || "N/A",
              emergencyContacts: detailData.user?.emergencyContacts || [],
              aadharDetails: detailData.user?.aadharDetails || "N/A",
              email: detailData.user?.email || "N/A",
              vitalSigns: {
                heartRate: detailData.heartRate || "N/A",
                bloodPressure: detailData.bloodPressure || "N/A",
                oxygenSaturation: detailData.Spo2 || "N/A"
              }
            }
          });
        } catch (error) {
          console.error("Error fetching case details:", error);
        }
      };
      
      fetchCaseDetails();
    } else {
      setSelectedCaseDetails(null);
    }
  }, [selectedCase]);

  // Format timestamp to "X min ago" format
  const formatTimeDifference = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Convert to minutes
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hr ago`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Filter cases based on display mode (active/resolved) and search term
  const filteredCases = emergencyCases.filter(c => {
    const matchesStatus = displayMode === 'active' ? c.status === 'Active' : c.status === 'Resolved';
    const matchesSearch = searchTerm === '' || 
      c.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Mock data for responders - would come from an API in production
  const responders = [
    { id: 'R-001', name: 'Dr. Ananya Reddy', specialty: 'Emergency Medicine', status: 'Available' },
    { id: 'R-002', name: 'Paramedic Team Alpha', specialty: 'Critical Care', status: 'En Route' },
    { id: 'R-003', name: 'Dr. Arjun Mehta', specialty: 'Trauma Surgery', status: 'Available' },
    { id: 'R-004', name: 'Ambulance Unit 42', specialty: 'Transport', status: 'Available' },
  ];

  // Get severity badge variant
  const getSeverityVariant = (severity) => {
    switch(severity.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'destructive';
      case 'medium':
        return 'warning';
      default:
        return 'outline';
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="p-6 bg-slate-50 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Emergency Management</h1>
          <p className="text-gray-600 mb-6">Track and manage emergency cases</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case List */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-1"
          >
            <Card className="bg-white shadow-md h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-800">Emergency Cases</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant={displayMode === 'active' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setDisplayMode('active')}
                    >
                      Active
                    </Button>
                    <Button 
                      variant={displayMode === 'resolved' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setDisplayMode('resolved')}
                    >
                      Resolved
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search cases..." 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  </div>
                ) : filteredCases.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No emergency cases found</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {filteredCases.map((emergency) => (
                      <motion.div
                        key={emergency.id}
                        variants={item}
                        onClick={() => setSelectedCase(emergency)}
                        className={`p-4 rounded-lg border cursor-pointer hover:bg-blue-50 transition-colors ${
                          selectedCase?.id === emergency.id ? 'bg-blue-50 border-blue-300' : 'bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800">{emergency.id}</span>
                              <Badge variant={getSeverityVariant(emergency.severity)}>
                                {emergency.severity}
                              </Badge>
                            </div>
                            <h3 className="font-medium mt-1">{emergency.patient}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">{`${emergency.location.slice(0, 40)}...`}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">{emergency.time}</div>
                            <div className="mt-1 text-sm font-medium text-blue-600">{emergency.type}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Case Details */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-2"
          >
            {selectedCaseDetails ? (
              <Card className="bg-white shadow-md">
                <CardHeader className="pb-2 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-bold text-gray-800">
                          Case {selectedCaseDetails.id}
                        </CardTitle>
                        <Badge variant={getSeverityVariant(selectedCaseDetails.severity)}>
                          {selectedCaseDetails.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{selectedCaseDetails.type} Emergency</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // In a real app, this would likely dial a phone number or open a messaging interface
                          if (selectedCaseDetails.details.contact && selectedCaseDetails.details.contact !== "N/A") {
                            alert(`Contacting: ${selectedCaseDetails.details.contact}`);
                          } else {
                            alert("No contact information available");
                          }
                        }}
                      >
                        <Phone className="h-4 w-4 mr-1" /> Contact
                      </Button>
                      <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Ambulance className="h-4 w-4 mr-1" /> Assign Responder
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <Tabs defaultValue="details">
                    <TabsList className="mb-4">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="responders">Responders</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Patient Information</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <User className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{selectedCaseDetails.patient}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <CalendarClock className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Age</p>
                                <p className="font-medium">{selectedCaseDetails.details.age}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Contact</p>
                                <p className="font-medium">{selectedCaseDetails.details.contact}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium">{selectedCaseDetails.location}</p>
                              </div>
                            </div>
                            {selectedCaseDetails.details.email && (
                              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm text-gray-500">Email</p>
                                  <p className="font-medium">{selectedCaseDetails.details.email}</p>
                                </div>
                              </div>
                            )}
                            {selectedCaseDetails.details.bloodGroup && (
                              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <Droplets className="h-4 w-4 text-red-500" />
                                <div>
                                  <p className="text-sm text-gray-500">Blood Group</p>
                                  <p className="font-medium">{selectedCaseDetails.details.bloodGroup}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-semibold mt-6 mb-3">Medical History</h3>
                          <div className="p-3 bg-gray-50 rounded">
                            <p>{selectedCaseDetails.details.medicalHistory}</p>
                          </div>

                          {selectedCaseDetails.details.emergencyContacts && selectedCaseDetails.details.emergencyContacts.length > 0 && (
                            <>
                              <h3 className="text-lg font-semibold mt-6 mb-3">Emergency Contacts</h3>
                              <div className="space-y-2">
                                {selectedCaseDetails.details.emergencyContacts.map((contact, index) => (
                                  <div key={index} className="p-3 bg-gray-50 rounded">
                                    <p className="font-medium">{contact.name}</p>
                                    <p className="text-sm text-gray-500">{contact.number}</p>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Vital Signs</h3>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-red-50 rounded text-center">
                              <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                              <p className="text-sm text-gray-500">Heart Rate</p>
                              <p className="font-bold text-lg text-red-600">{selectedCaseDetails.details.vitalSigns.heartRate}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded text-center">
                              <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                              <p className="text-sm text-gray-500">Blood Pressure</p>
                              <p className="font-bold text-lg text-blue-600">{selectedCaseDetails.details.vitalSigns.bloodPressure}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded text-center">
                              {/* <Lungs className="h-5 w-5 text-green-500 mx-auto mb-1" /> */}
                              <p className="text-sm text-gray-500">SpO2</p>
                              <p className="font-bold text-lg text-green-600">{selectedCaseDetails.details.vitalSigns.oxygenSaturation}</p>
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold mt-6 mb-3">Emergency Notes</h3>
                          <div className="p-3 bg-gray-50 rounded">
                            <p>{selectedCaseDetails.type} emergency requiring immediate attention</p>
                          </div>
                          
                          <h3 className="text-lg font-semibold mt-6 mb-3">Emergency Location</h3>
                          {selectedCaseDetails.lat && selectedCaseDetails.long ? (
                            <div className="h-64 bg-gray-100 rounded-md relative overflow-hidden">
                              <iframe
                                title="Emergency Location"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyC5pnj_yE8KEUThBlHUFP6dNwlDj2EiU5Y&q=${selectedCaseDetails.lat},${selectedCaseDetails.long}&zoom=16`}
                                allowFullScreen
                              ></iframe>
                              
                            </div>
                          ) : (
                            <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
                              <p className="text-gray-500">Location coordinates not available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="responders">
                      <div>
                        <div className="flex justify-between mb-4">
                          <h3 className="text-lg font-semibold">Available Responders</h3>
                          <Button variant="outline" size="sm">
                            <User className="h-4 w-4 mr-1" /> Add Responder
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          {responders.map((responder) => (
                            <div key={responder.id} className="p-4 border rounded-lg bg-white flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{responder.name}</h4>
                                <p className="text-sm text-gray-500">{responder.specialty}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={responder.status === 'Available' ? 'success' : 'outline'}>
                                  {responder.status}
                                </Badge>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    alert(`Assigned ${responder.name} to case ${selectedCaseDetails.id}`);
                                  }}
                                >
                                  Assign
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="timeline">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Event Timeline</h3>
                        <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
                          <div className="relative">
                            <div className="absolute -left-[22px] bg-red-500 rounded-full h-4 w-4"></div>
                            <div className="mb-1">
                              <span className="text-sm text-gray-500">{new Date(selectedCaseDetails.details.userId ? parseInt(selectedCaseDetails.details.userId.split('_')[1], 36) : Date.now()).toLocaleString()}</span>
                            </div>
                            <p className="font-medium">Emergency SOS Triggered</p>
                            <p className="text-sm text-gray-600">Patient triggered SOS alert via mobile app</p>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[22px] bg-blue-500 rounded-full h-4 w-4"></div>
                            <div className="mb-1">
                              <span className="text-sm text-gray-500">{new Date(Date.now() - 2 * 60000).toLocaleString()}</span>
                            </div>
                            <p className="font-medium">Case Created</p>
                            <p className="text-sm text-gray-600">System automatically created case #{selectedCaseDetails.id}</p>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[22px] bg-amber-500 rounded-full h-4 w-4"></div>
                            <div className="mb-1">
                              <span className="text-sm text-gray-500">{new Date(Date.now() - 1 * 60000).toLocaleString()}</span>
                            </div>
                            <p className="font-medium">Triage Complete</p>
                            <p className="text-sm text-gray-600">Case classified as {selectedCaseDetails.severity} priority</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white shadow-md h-full">
                <CardContent className="h-full flex items-center justify-center p-12">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No Case Selected</h3>
                    <p className="text-gray-500 max-w-md">
                      Select an emergency case from the list to view detailed information and manage response.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMgmt;