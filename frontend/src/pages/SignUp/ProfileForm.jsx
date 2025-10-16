import React, { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Phone, AlertCircle, Heart, User, IdCard, UserCheck, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

const ProfileForm = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    bloodGroup: '',
    diseases: [],
    emergencyContacts: [],
    aadharDetails: '',
    age: '',
    isVolunteer: false
  });

  const [diseaseInput, setDiseaseInput] = useState('');
  const [emergencyContactInput, setEmergencyContactInput] = useState({
    name: '',
    number: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    
    // Blood group validation
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = "Blood group is required";
    }
    
    // Aadhar validation
    if (!formData.aadharDetails) {
      newErrors.aadharDetails = "Aadhar details are required";
    } else if (!/^\d{12}$/.test(formData.aadharDetails)) {
      newErrors.aadharDetails = "Aadhar should be 12 digits";
    }
    
    // Emergency contacts validation
    if (formData.emergencyContacts.length === 0) {
      newErrors.emergencyContacts = "At least one emergency contact is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSelectChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleDiseaseInputChange = (e) => {
    setDiseaseInput(e.target.value);
  };

  const addDisease = () => {
    if (diseaseInput.trim()) {
      setFormData({
        ...formData,
        diseases: [...formData.diseases, diseaseInput.trim()]
      });
      setDiseaseInput('');
    }
  };

  const removeDisease = (index) => {
    const updatedDiseases = [...formData.diseases];
    updatedDiseases.splice(index, 1);
    setFormData({ ...formData, diseases: updatedDiseases });
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setEmergencyContactInput({
      ...emergencyContactInput,
      [name]: value
    });
  };

  const addEmergencyContact = () => {
    if (emergencyContactInput.name.trim() && emergencyContactInput.number.trim()) {
      setFormData({
        ...formData,
        emergencyContacts: [...formData.emergencyContacts, { 
          name: emergencyContactInput.name.trim(), 
          number: emergencyContactInput.number.trim() 
        }]
      });
      setEmergencyContactInput({ name: '', number: '' });
      
      // Clear error if it exists
      if (errors.emergencyContacts) {
        setErrors({ ...errors, emergencyContacts: null });
      }
    }
  };

  const removeEmergencyContact = (index) => {
    const updatedContacts = [...formData.emergencyContacts];
    updatedContacts.splice(index, 1);
    setFormData({ ...formData, emergencyContacts: updatedContacts });
  };

  const handleVolunteerChange = (checked) => {
    setFormData({
      ...formData,
      isVolunteer: checked
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.", {
        description: "Some required fields need your attention."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
        console.log(formData);
        
      const response = await fetch('http://localhost:3000/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clerkUserId: user.id,
          email: user.primaryEmailAddress.emailAddress,
          ...formData,
        }),
      });

      if (response.ok) {
        toast.success("Success!", {
          description: "Your medical profile has been saved successfully."
        });
        navigate('/profile');
      } else {
        const errorData = await response.json().catch(() => null);
        toast.error("Submission failed", {
          description: errorData?.message || "Failed to save profile. Please try again."
        });
      }
    } catch (error) {
      toast.error("Connection error", {
        description: "Please check your network and try again."
      });
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <>
    <Navbar />
    <div className="max-w-2xl mx-auto p-4">
      <Card className="w-full shadow-lg">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <UserCheck className="h-6 w-6 text-blue-600" />
            Medical Profile
          </CardTitle>
          <CardDescription>
            Please provide your medical details for emergency purposes
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {/* User info display */}
            <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Logged in as:</p>
                <p className="text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username.."
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Enter your 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                Age
              </Label>
              <Input
                id="age"
                name="age"
                placeholder="Enter your age.."
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            
            {/* Blood Group */}
            <div className="space-y-2">
              <Label htmlFor="bloodGroup" className="flex items-center gap-2">
                <Heart className="h-4 w-4" /> Blood Group
              </Label>
              <Select 
                name="bloodGroup" 
                value={formData.bloodGroup} 
                onValueChange={(value) => handleSelectChange(value, "bloodGroup")}
              >
                <SelectTrigger className={errors.bloodGroup ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bloodGroup && (
                <p className="text-sm text-red-500">{errors.bloodGroup}</p>
              )}
            </div>
            
            {/* Diseases */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Medical Conditions
              </Label>
              <div className="flex gap-2">
                <Input
                  value={diseaseInput}
                  onChange={handleDiseaseInputChange}
                  placeholder="Enter a medical condition or allergy"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addDisease}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.diseases.map((disease, index) => (
                  <div key={index} className="bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="text-sm">{disease}</span>
                    <button 
                      type="button" 
                      onClick={() => removeDisease(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {formData.diseases.length === 0 && (
                  <p className="text-sm text-gray-500">No medical conditions added</p>
                )}
              </div>
            </div>
            
            {/* Emergency Contacts */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Emergency Contacts
              </Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    name="name"
                    value={emergencyContactInput.name}
                    onChange={handleEmergencyContactChange}
                    placeholder="Contact Name"
                    className="flex-1"
                  />
                  <Input
                    name="number"
                    value={emergencyContactInput.number}
                    onChange={handleEmergencyContactChange}
                    placeholder="Contact Number"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={addEmergencyContact}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.emergencyContacts && (
                  <p className="text-sm text-red-500">{errors.emergencyContacts}</p>
                )}
              </div>
              <div className="space-y-2 mt-2">
                {formData.emergencyContacts.map((contact, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.number}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeEmergencyContact(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formData.emergencyContacts.length === 0 && (
                  <p className="text-sm text-gray-500">No emergency contacts added</p>
                )}
              </div>
            </div>
            
            {/* Aadhar Details */}
            <div className="space-y-2">
              <Label htmlFor="aadharDetails" className="flex items-center gap-2">
                <IdCard className="h-4 w-4" /> Aadhar Number
              </Label>
              <Input
                id="aadharDetails"
                name="aadharDetails"
                placeholder="Enter your 12-digit Aadhar number"
                value={formData.aadharDetails}
                onChange={handleChange}
                className={errors.aadharDetails ? "border-red-500" : ""}
                maxLength={12}
              />
              {errors.aadharDetails && (
                <p className="text-sm text-red-500">{errors.aadharDetails}</p>
              )}
            </div>
            
            {/* Privacy Notice */}
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle>Privacy Notice</AlertTitle>
              <AlertDescription className="text-sm">
                Your medical information is stored securely and will only be used in case of emergencies. You can update or delete this information anytime.
              </AlertDescription>
            </Alert>
            
            {/* Volunteer Checkbox */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="volunteer" 
                  checked={formData.isVolunteer}
                  onCheckedChange={handleVolunteerChange}
                />
                <Label htmlFor="volunteer" className="font-medium">
                  I want to volunteer my medical information
                </Label>
              </div>
              
              {formData.isVolunteer && (
                <div className="bg-blue-50 p-3 rounded-md mt-2">
                  <p className="text-sm text-gray-700">
                    By volunteering, you allow your medical details to be used in case of emergency situations to help others in need. This includes your blood group and medical information being shared with medical personnel for potential matching in critical situations. Your personal contact information will remain private.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-3 border-t p-6 bg-slate-50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setFormData({
                phone: '',
                bloodGroup: '',
                diseases: [],
                emergencyContacts: [],
                aadharDetails: '',
                isVolunteer: false
              })}
            >
              Clear
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
    </>
  );
};

export default ProfileForm;