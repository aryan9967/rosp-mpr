import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Video, Phone, Clock, Filter, User, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

const LiveVideoCall = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  // Simulated data for available doctors
  useEffect(() => {
    const mockDoctors = [
      {
        id: 1,
        name: 'Dr. Sarah Khan',
        specialty: 'Cardiology',
        status: 'online',
        responseTime: '< 5 min',
        rating: 4.9,
        image: '/avatars/doctor-1.jpg',
        patientCount: 1243
      },
      {
        id: 2,
        name: 'Dr. Mitrang Jain',
        specialty: 'General Medicine',
        status: 'online',
        responseTime: '< 10 min',
        rating: 4.7,
        image: '/avatars/doctor-2.jpg',
        patientCount: 876
      },
      {
        id: 3,
        name: 'Dr. Anamika Maurya',
        specialty: 'Pediatrics',
        status: 'offline',
        responseTime: '2-4 hours',
        rating: 4.8,
        image: '/avatars/doctor-3.jpg',
        patientCount: 1589
      },
      {
        id: 4,
        name: 'Dr. Jahnvi Kadam',
        specialty: 'Neurology',
        status: 'online',
        responseTime: '< 15 min',
        rating: 4.6,
        image: '/avatars/doctor-4.jpg',
        patientCount: 654
      },
      {
        id: 5,
        name: 'Dr. Priya Patel',
        specialty: 'Dermatology',
        status: 'online',
        responseTime: '< 20 min',
        rating: 4.9,
        image: '/avatars/doctor-5.jpg',
        patientCount: 1032
      },
      {
        id: 6,
        name: 'Dr. Atharva Mhatre',
        specialty: 'Orthopedics',
        status: 'offline',
        responseTime: '3-5 hours',
        rating: 4.5,
        image: '/avatars/doctor-6.jpg',
        patientCount: 789
      }
    ];

    setDoctors(mockDoctors);
    setFilteredDoctors(mockDoctors);
  }, []);

  // Filter doctors based on specialty and availability
  useEffect(() => {
    let filtered = [...doctors];

    // Apply specialty filter
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(doctor => doctor.specialty === specialtyFilter);
    }

    // Apply availability filter
    if (availabilityFilter === 'online') {
      filtered = filtered.filter(doctor => doctor.status === 'online');
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query)
      );
    }

    setFilteredDoctors(filtered);
  }, [doctors, specialtyFilter, availabilityFilter, searchQuery]);

  const handleRequestAssistance = (doctor) => {
    setSelectedDoctor(doctor);
    setShowRequestDialog(true);
  };

  const handleCall = async (doctor, symptoms) => {
    try {
      setShowRequestDialog(false)
      const response = await axios.post('http://localhost:3000/create-call', { doctor, symptoms });
    } catch (error) {
      console.log(error);
    }
  }
  const submitRequest = () => {
    // In a real app, this would send the request to the backend
    setShowRequestDialog(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    setSymptoms('');
  };

  const getUniqueSpecialties = () => {
    const specialties = new Set(doctors.map(doctor => doctor.specialty));
    return Array.from(specialties);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-100 p-4">
        <div className="max-w-6xl mx-auto pt-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 text-transparent bg-clip-text">Live Medical Assistance</h1>
            <p className="text-gray-600 mt-2">
              Connect with healthcare professionals for immediate medical advice
            </p>
          </motion.div>

          {/* Success notification */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg text-green-800"
            >
              Your assistance request has been sent successfully! A doctor will connect with you shortly.
            </motion.div>
          )}

          {/* Filters section */}
          <div className="mb-8 bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-1/3">
                <Input
                  placeholder="Search doctors by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-1/4">
                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {getUniqueSpecialties().map(specialty => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-1/4">
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="online">Online Now</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Doctor cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 border-2 border-gray-100">
                        <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        <AvatarImage src={doctor.image} alt={doctor.name} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{doctor.name}</h3>
                            <p className="text-gray-600">{doctor.specialty}</p>
                          </div>
                          <Badge variant={doctor.status === 'online' ? 'success' : 'secondary'} className={`${doctor.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {doctor.status === 'online' ? 'Online' : 'Offline'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center text-amber-500">
                            {'★'.repeat(Math.floor(doctor.rating))}
                            <span className="text-gray-600 ml-1">{doctor.rating}</span>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {doctor.patientCount}+ patients
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>Typical response time: {doctor.responseTime}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1" disabled={doctor.status !== 'online'}>
                          <MessageSquare className="h-4 w-4 mr-1" /> Message
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open("https://console-api-sig.zegocloud.com/s/uikit/QnqQrm", "_blank")}
                        >
                          <Video className="h-4 w-4 mr-1" /> Contact
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" disabled={doctor.status !== 'online'}>
                          <Phone className="h-4 w-4 mr-1" /> Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={doctor.status !== 'online'}
                      onClick={() => handleRequestAssistance(doctor)}
                    >
                      Request Assistance
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No doctors match your current filters.</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSpecialtyFilter('all');
                setAvailabilityFilter('all');
                setSearchQuery('');
              }}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Request Assistance Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Assistance from {selectedDoctor?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Tabs defaultValue="symptoms">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="symptoms">Share Symptoms</TabsTrigger>
                <TabsTrigger value="upload">Upload Files</TabsTrigger>
              </TabsList>
              <TabsContent value="symptoms" className="pt-4">
                <p className="text-sm text-gray-600 mb-3">
                  Please describe your symptoms or medical concern:
                </p>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe what you're experiencing..."
                  className="min-h-[120px]"
                />
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                  <Shield className="h-4 w-4" />
                  <span>Your information is secure and will only be shared with your doctor</span>
                </div>
              </TabsContent>
              <TabsContent value="upload" className="pt-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-3">
                    Drag and drop medical files, images, or test results
                  </p>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                  <p className="text-xs text-gray-400 mt-3">
                    Supported formats: JPG, PNG, PDF (Max 10MB)
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowRequestDialog(false)} className="sm:flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleCall(selectedDoctor, symptoms)
              }}
              className="bg-blue-600 hover:bg-blue-700 sm:flex-1"
              disabled={!symptoms.trim() && true}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Chatbot />
      <Footer />
    </div>
  );
};

export default LiveVideoCall;