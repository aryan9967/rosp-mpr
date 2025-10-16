import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertCircle, Bell, Users, Settings, FileText, ShieldPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Chatbot from '@/components/Chatbot';
import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const quickActions = [
    {
      title: "Emergency SOS",
      description: "One-tap emergency alert system",
      icon: <AlertCircle className="h-8 w-8 text-red-500" />,
      link: "/emergency-sos",
      color: "bg-red-100 hover:bg-red-200",
      textColor: "text-red-800"
    },
    {
      title: "Medical Records",
      description: "Secure storage of your health data",
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      link: "/medical-records",
      color: "bg-purple-100 hover:bg-purple-200",
      textColor: "text-purple-800"
    },
    {
      title: "Community Support",
      description: "Connect with nearby volunteers",
      icon: <Users className="h-8 w-8 text-teal-500" />,
      link: "/community",
      color: "bg-teal-100 hover:bg-teal-200",
      textColor: "text-teal-800"
    },
    {
      title: "Settings",
      description: "Manage your profile and preferences",
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      link: "/settings",
      color: "bg-gray-100 hover:bg-gray-200",
      textColor: "text-gray-800"
    }
  ];

  const stats = [
    { label: "SOS Calls Made", value: 5 },
    { label: "Guides Accessed", value: 12 },
    { label: "Active Alerts", value: 2 },
    { label: "Community Interactions", value: 8 }
  ];

  const recentActivity = [
    {
      title: "Emergency SOS Activated",
      description: "Activated SOS near Mumbai City Hospital",
      time: "5 mins ago"
    },
    {
      title: "First Aid Guide Viewed",
      description: "Checked CPR instructions",
      time: "2 hours ago"
    },
    {
      title: "Medical Record Updated",
      description: "Latest test results from Dr. Smith",
      time: "Yesterday"
    }
  ];

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-lg">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <p className="text-lg text-red-500">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-800">Welcome Back, {profile?.username || 'User'}!</h1>
              <p className="text-gray-600">Here's an overview of your recent activity.</p>
            </motion.div>

            {/* Notification and Profile */}
            <motion.div 
              className="flex items-center gap-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  3
                </span>
              </Button>
              <Avatar>
                <AvatarImage src="/api/placeholder/32/32" alt="User" />
                <AvatarFallback>{profile?.username ? profile.username[0] : 'U'}</AvatarFallback>
              </Avatar>
            </motion.div>
          </div>

          {/* User Profile Card */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow border-none">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your health profile and emergency contacts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Profile Details</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {profile?.username}</p>
                      <p><span className="font-medium">Age:</span> {profile?.age}</p>
                      <p><span className="font-medium">Email:</span> {profile?.email}</p>
                      <p><span className="font-medium">Phone:</span> {profile?.phone}</p>
                      <p><span className="font-medium">Blood Group:</span> <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">{profile?.bloodGroup}</Badge></p>
                      <p><span className="font-medium">Aadhar:</span> {profile?.aadharDetails}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Medical Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Conditions:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {profile?.diseases?.map((disease, index) => (
                            <Badge key={index} variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">{disease}</Badge>
                          ))}
                          {profile?.diseases?.length === 0 && <span className="text-gray-500">None reported</span>}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Emergency Contacts:</span>
                        <div className="mt-1 space-y-2">
                          {profile?.emergencyContacts?.map((contact, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">{contact.name[0]}</AvatarFallback>
                              </Avatar>
                              <span>{contact.name}: {contact.number}</span>
                            </div>
                          ))}
                          {profile?.emergencyContacts?.length === 0 && <span className="text-gray-500">No emergency contacts added</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Overview */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {stats.map((stat, index) => (
              <Card key={index} className="shadow border-none bg-white">
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold">{stat.value}</h3>
                  <p className="text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {quickActions.map((action, index) => (
              <Link to={action.link} key={index}>
                <Card className={`cursor-pointer ${action.color} shadow-md hover:shadow-lg`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    {action.icon}
                    <div>
                      <h4 className={`text-lg font-medium ${action.textColor}`}>{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow border-none">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center py-3 border-b last:border-b-0"
                  >
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-gray-500 text-sm">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
          {/* <Chatbot /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;