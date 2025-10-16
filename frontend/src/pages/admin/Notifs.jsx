import React, { useState } from 'react';
import { AlertCircle, Bell, Send, Mail, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import AdminNavbar from '@/components/AdminNavbar';

const Notifs = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'Critical', message: 'Emergency SOS received from John Doe', time: '2 min ago' },
    { id: 2, type: 'High', message: 'Ambulance dispatched to 456 Park Ave', time: '5 min ago' },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'Dr. Sarah Johnson', message: 'We need additional support at 123 Main St.', time: '3 min ago' },
    { id: 2, sender: 'Paramedic Team Alpha', message: 'Patient is stable now.', time: '8 min ago' },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: 'You', message: newMessage, time: 'Just now' }]);
      setNewMessage('');
    }
  };

  return (
    <div>
      <AdminNavbar />
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 overflow-y-auto">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-2 p-2 border-b">
                  <AlertCircle className="text-red-500 h-6 w-6" />
                  <div>
                    <p className="text-sm font-medium">{notif.message}</p>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                  <Badge variant={notif.type === 'Critical' ? 'destructive' : 'warning'}>{notif.type}</Badge>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Messaging System */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Messaging System</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 overflow-y-auto mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col gap-1 mb-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">{msg.sender}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{msg.message}</p>
                </div>
              ))}
            </ScrollArea>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button onClick={sendMessage}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default Notifs;
