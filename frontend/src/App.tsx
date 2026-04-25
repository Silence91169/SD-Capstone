import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Documents from './pages/Documents';
import UploadDocument from './pages/UploadDocument';
import EmergencyAccess from './pages/EmergencyAccess';
import PublicEmergencyProfile from './pages/PublicEmergencyProfile';
import HealthAnalytics from './pages/HealthAnalytics';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/documents/upload" element={<UploadDocument />} />
        <Route path="/emergency-access" element={<EmergencyAccess />} />
        <Route path="/health-analytics" element={<HealthAnalytics />} />
        <Route path="/public/emergency/:token" element={<PublicEmergencyProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
