import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminNavbar from '@/components/AdminNavbar';
import { useNavigate } from 'react-router-dom';

const VideoCallDoctor = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  // Fetch data from API instead of using mock data
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await fetch('http://localhost:3000/all-calls'); // Adjust the URL based on your backend setup
        const data = await response.json();
        console.log(data);

        // Transform data to match existing structure
        const formattedRequests = data.map(call => ({
          id: call.doctor.id || `${Date.now()}`,  // Ensure ID exists
          user: {
            name: call.doctor.name || 'Unknown Doctor', // Adjust based on actual API response
          },
          symptoms: call.symptoms || 'Not specified',
          status: call.status || 'Pending',
          requestedAt: call.date || new Date().toISOString(),
        }));

        setRequests(formattedRequests);
        setFilteredRequests(formattedRequests);
      } catch (error) {
        console.error('Error fetching video call requests:', error);
      }
    };

    fetchCalls();
  }, []);

  // Filter requests based on status and search query
  useEffect(() => {
    let filtered = [...requests];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request =>
        request.user.name.toLowerCase().includes(query) ||
        request.symptoms.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(filtered);
  }, [requests, statusFilter, searchQuery]);

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto pt-6 pb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Video Call Requests</h1>
            <p className="text-gray-600 mt-2">Manage and track all video call requests from users</p>
          </motion.div>

          {/* Filters section */}
          <div className="mb-8 bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-1/3">
                <Input placeholder="Search requests by user or symptoms..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full" />
              </div>
              <div className="w-full sm:w-1/4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Request Table */}
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-800">Request List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3 text-sm font-medium text-gray-700">ID</th>
                      <th className="p-3 text-sm font-medium text-gray-700">User</th>
                      <th className="p-3 text-sm font-medium text-gray-700">Symptoms</th>
                      <th className="p-3 text-sm font-medium text-gray-700">Status</th>
                      <th className="p-3 text-sm font-medium text-gray-700">Requested At</th>
                      <th className="p-3 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request, index) => (
                      <motion.tr key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm text-gray-800">{request.id}</td>
                        <td className="p-3 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{request.user.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-gray-800">{request.symptoms}</td>
                        <td className="p-3 text-sm text-gray-800">
                          <Badge variant={
                            request.status === 'Pending' ? 'warning' :
                              request.status === 'Assigned' ? 'success' :
                                request.status === 'Resolved' ? 'outline' : 'destructive'
                          }>
                            {request.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-gray-800">
                          {new Date(request.requestedAt).toLocaleString()}
                        </td>
                        <td className="p-3 text-sm text-gray-800">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open("https://console-api-sig.zegocloud.com/s/uikit/QnqQrm", "_blank")}
                          >
                            <Phone className="h-4 w-4 mr-1" /> Contact
                          </Button>

                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoCallDoctor;
