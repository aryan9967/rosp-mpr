import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Users, 
  Clock, 
  Ambulance, 
  AlertTriangle, 
  TrendingUp, 
  Map, 
  List, 
  Calendar 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminNavbar from '@/components/AdminNavbar';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

const AdminDashboard = () => {
  const [view, setView] = useState('list');
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timeAgo = new TimeAgo('en-US')
  
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

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const response = await fetch('http://localhost:3000/all-emergency');
        if (!response.ok) throw new Error('Failed to fetch emergencies');
        const data = await response.json();
        setEmergencies(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencies();
  }, []);

  const metrics = [
    { title: 'Active Emergencies', value: emergencies.length, icon: <AlertTriangle className="h-8 w-8 text-red-500" /> },
    { title: 'Avg Response Time', value: '4.2 min', icon: <Clock className="h-8 w-8 text-amber-500" /> },
    { title: 'Pending Dispatches', value: '3', icon: <Ambulance className="h-8 w-8 text-blue-500" /> },
    { title: 'Critical Alerts', value: '5', icon: <Bell className="h-8 w-8 text-purple-500" /> },
  ];

  return (
    <div>
        <AdminNavbar />
    <div className="p-6 bg-slate-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mb-6">Overview of emergency medical assistance system</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {metrics.map((metric, index) => (
          <motion.div key={index} variants={item}>
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-full">
                    {metric.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Emergencies */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-6"
      >
        <Card className="bg-white shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-800">Active Emergencies</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant={view === 'map' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setView('map')}
                >
                  <Map className="h-4 w-4 mr-1" /> Map
                </Button>
                <Button 
                  variant={view === 'list' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setView('list')}
                >
                  <List className="h-4 w-4 mr-1" /> List
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {view === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Patient</th>
                      <th className="px-4 py-3 text-left">Location</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Time</th>
                      <th className="px-4 py-3 text-left">Severity</th>
                      <th className="px-4 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emergencies?.map((emergency, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{emergency.emergencyId}</td>
                        <td className="px-4 py-3 font-medium">{emergency.name}</td>
                        <td className="px-4 py-3">{emergency.location}</td>
                        <td className="px-4 py-3">{emergency.cause}</td>
                        <td className="px-4 py-3">{emergency.date ? timeAgo.format(emergency.date) : ''}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            emergency.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                            emergency.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {emergency.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" className="text-xs">View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Interactive map view would appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

     
    </div>
    </div>
  );
};

export default AdminDashboard;