// Install required packages
// npm install react-router-dom framer-motion lucide-react

// In App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import EmergencySOS from './pages/EmergencySOS';
import HospitalLocator from './pages/HospitalLocator';
import SymptomChecker from './pages/SymptomChecker';
import FirstAidGuide from './pages/FirstAidGuide';
import MedicalRecords from './pages/MedicalRecords';
import LiveVideoCall from './pages/LiveVideoCall';
import Community from './pages/Community';

import SignUpForm from './pages/SignUp/Signup';

import AdminDashboard from './pages/admin/AdminDashboard';
import EmergencyMgmt from './pages/admin/EmergencyMgmt';
import Notifs from './pages/admin/Notifs';
// import VideoCallPage from './pages/admin/Videocall';
// import LiveVideoCall from './pages/LiveVideoCall';
import ProfileForm from './pages/SignUp/ProfileForm';
import PharmacyLocator from './pages/PharmacyLocator';
import MedicineOrderPage from './pages/Medicines';

import VideoCallDoctor from './pages/admin/Videocall';
import VideoCall from './pages/VideoCall';
import VideoCalling from './pages/admin/VideoCalling';

import NearbyPharmaciesMap from './pages/NearbyPharmaciesMap';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/video" element={<VideoCall/>} />
{/* 
        <Route path="/video" element={<VideoCall/>} /> */}
        <Route path="/medicines" element={<MedicineOrderPage />} />
        {/* <Route path="/video/:roomID/:userID/:userName" element={<VideoCall/>} /> */}
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/emergency-sos" element={<EmergencySOS />} />
        <Route path="/hospital-locator" element={<HospitalLocator />} />
        <Route path="/pharmacy-locator" element={<PharmacyLocator />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/first-aid-guide" element={<FirstAidGuide />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/videocall" element={<LiveVideoCall />} />
        <Route path="/community" element={<Community />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/emergency" element={<EmergencyMgmt />} />
        <Route path="/admin/notifs" element={<Notifs />} />
        {/* <Route path="/nearmeds" element={<NearbyPharmaciesMap />} /> */}
        <Route path="/admin/videocall" element={<VideoCallDoctor />} />
        <Route path="/admin/video-calling" element={<VideoCalling />} />

      </Routes>
     
    </Router>
  );
}

export default App;