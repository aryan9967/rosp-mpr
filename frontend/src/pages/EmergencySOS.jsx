import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Video,
  MessageSquare,
  MapPin,
  Users,
  AlertCircle,
  X,
  User,
  HeartPulse,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import Chatbot from "@/components/Chatbot";

export const fetchLocationName = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    return response.data.display_name; // Returns formatted address
  } catch (error) {
    console.error("Error fetching location name:", error);
    return `Lat: ${latitude}, Lng: ${longitude}`; // Fallback to coordinates if API fails
  }
};

const EmergencySOS = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([
    "Emergency Services",
    "Dr. Johnson",
  ]);
  const [profile, setProfile] = useState();
  const {user} = useUser()  

  const handleSOSClick = () => {
    if (!isActivated) {
      setShowConfirmation(true);
    } else {
      handleCancel();
    }
  };

  const confirmSOS = async () => {
    try {
      setIsActivated(true);
      setShowConfirmation(false);
  
      // Get user's location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          // Fetch location name using Nominatim (OpenStreetMap)
          const locationName = await fetchLocationName(latitude, longitude);
  
          // Send SOS request with location data
          await axios.post('http://localhost:3000/create-sos', {
            userId: user.id,
            lat : latitude,
            long : longitude,
            location: locationName,
          });
  
          // Simulate progress updates
          const interval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 100) {
                clearInterval(interval);
                return 100;
              }
              return prev + 10;
            });
          }, 1000);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } catch (error) {
      console.error("Error sending SOS:", error);
    }
  };
  
  // Function to fetch human-readable address from lat/lng
  
  
  const handleCancel = () => {
    setIsActivated(false);
    setProgress(0);
    setShowConfirmation(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profile");
        setProfile(response.data);
      } catch {
        toast("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  const contacts = profile?.emergencyContacts?.map((data) => {
    return {
      ...data,
      selected: true,
    };
  });

  const toggleContact = (name) => {
    if (selectedContacts.includes(name)) {
      setSelectedContacts(
        selectedContacts.filter((contact) => contact !== name)
      );
    } else {
      setSelectedContacts([...selectedContacts, name]);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto pt-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800">Emergency SOS</h1>
            <p className="text-gray-600 mt-2">
              Activate emergency assistance with one tap
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main SOS Button Column */}
            <div className="md:col-span-2">
              <Card className="border-none shadow-lg bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className={`p-8 ${
                      isActivated ? "bg-red-600" : "bg-white"
                    } transition-colors duration-500`}
                  >
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{
                          scale: isActivated ? [1, 1.05, 1] : 1,
                          transition: {
                            repeat: isActivated ? Infinity : 0,
                            duration: 2,
                          },
                        }}
                        className="mb-4 relative mx-auto"
                      >
                        <div
                          className={`w-48 h-48 rounded-full mx-auto flex items-center justify-center cursor-pointer ${
                            isActivated
                              ? "bg-white shadow-lg"
                              : "bg-red-600 hover:bg-red-700 shadow-xl hover:shadow-2xl"
                          } transition-all duration-300`}
                          onClick={handleSOSClick}
                        >
                          {isActivated ? (
                            <X className="h-16 w-16 text-red-600" />
                          ) : (
                            <AlertCircle className="h-16 w-16 text-white" />
                          )}
                        </div>

                        {isActivated && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.7, 0.5, 0.7],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "loop",
                            }}
                            className="absolute top-0 left-0 right-0 bottom-0 rounded-full bg-red-400 -z-10"
                          />
                        )}
                      </motion.div>

                      <h2
                        className={`text-2xl font-bold ${
                          isActivated ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {isActivated ? "SOS ACTIVATED" : "Tap to Activate SOS"}
                      </h2>
                      <p
                        className={`mt-2 ${
                          isActivated ? "text-red-100" : "text-gray-600"
                        }`}
                      >
                        {isActivated
                          ? "Help is on the way. Stay calm."
                          : "Press the button in case of medical emergency"}
                      </p>
                    </div>

                    {isActivated && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6"
                      >
                        <p className="text-white mb-2">
                          Contacting emergency services...
                        </p>
                        <Progress value={progress} className="h-2 bg-red-300" />

                        <div className="flex justify-center gap-4 mt-6">
                          <Button
                            variant="outline"
                            className="bg-white text-red-600 hover:bg-red-50"
                          >
                            <Phone className="h-4 w-4 mr-2" /> Call
                          </Button>
                          <Button
                            variant="outline"
                            className="bg-white text-red-600 hover:bg-red-50"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" /> Text
                          </Button>
                          <Button
                            variant="outline"
                            className="bg-white text-red-600 hover:bg-red-50"
                          >
                            <Video className="h-4 w-4 mr-2" /> Video
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {isActivated && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="p-4 bg-white border-t border-gray-100"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>
                          Current location being shared:{" "}
                          <strong>123 Main St, City, State</strong>
                        </span>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">
                      Your Health Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <User className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{profile?.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <HeartPulse className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Medical Conditions
                          </p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {profile?.diseases.map((data, index) => (
                              <Badge key={index}
                                variant="outline"
                                className="bg-red-50 text-red-800 border-red-200"
                              >
                                {data}
                              </Badge>
                            ))}

                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-medium">March 12, 2025</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Contacts and Settings Column */}
            <div>
              <Card className="border-none shadow-md mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Emergency Contacts</h3>
                  <div className="space-y-4">
                    {contacts?.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {contact.name.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{contact.name}</span>
                        </div>
                        <Switch
                          checked={selectedContacts.includes(contact.name)}
                          onCheckedChange={() => toggleContact(contact.name)}
                        />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Users className="h-4 w-4 mr-2" /> Add Contact
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">SOS Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-share location</Label>
                        <p className="text-sm text-gray-500">
                          Share precise GPS location
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Medical profile</Label>
                        <p className="text-sm text-gray-500">
                          Share medical conditions
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Volunteer alerts</Label>
                        <p className="text-sm text-gray-500">
                          Alert nearby trained volunteers
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-red-600">
                Confirm SOS Activation
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center mb-4">
                Are you sure you want to activate the emergency SOS?
              </p>
              <p className="text-sm text-gray-500">
                This will alert emergency services and your selected emergency
                contacts of your situation and location.
              </p>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="sm:w-full"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSOS}
                className="bg-red-600 hover:bg-red-700 sm:w-full"
              >
                Yes, Activate SOS
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* <Chatbot  /> */}
      </div>
    </div>
  );
};

export default EmergencySOS;
