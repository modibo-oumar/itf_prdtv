import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginScreen from './LoginScreen/LoginScreen.jsx';
import UserDashboard from './UserDashboard/UserDashboard.jsx';
import ElementDetails from './ElementDetails/ElementDetail.jsx';
import UserManagement from './UserManagement/UserManagement.jsx';
import SocieteManagement from './SocieteManagement/SocieteManagement.jsx';
import ZonesManagement from './ZoneManagement/ZonesManagement.jsx';
import SousZonesManagement from './SousZonesManagement/SousZonesManagement.jsx';
import EquipementsManagement from './EquipementsManagement/EquipementsManagement.jsx';
import SousEquipementsManagement from './SousEquipementsManagement/SousEquipementsManagement.jsx';
import ElementsManagement from './ElementsManagement/ElementsManagement.jsx';

// Custom hook to reload on back navigation
const useReloadOnBack = () => {
  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
};

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/login':
        document.title = 'Login';
        break;
      case '/admin':
        document.title = 'Page administrateur';
        break;
      case '/':
        document.title = 'Page utilisateur';
        break;
      default:
        document.title = 'Plateforme La predictive';
    }
  }, [location]);

  return null;
};

const AppContent = () => {
  useReloadOnBack(); // Call the hook here, within the Router context

  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={<UserDashboard />} />
      <Route path="/element/*" element={<ElementDetails />} />
      <Route path="/admin/utilisateurs" element={<UserManagement />} />
      <Route path="/admin" element={<UserManagement />} />
      <Route path='/admin/societes' element={<SocieteManagement />} />
      <Route path='/admin/zones' element={<ZonesManagement />} />
      <Route path='/admin/souszones' element={<SousZonesManagement />} />
      <Route path='/admin/equipements' element={<EquipementsManagement />} />
      <Route path='/admin/sousequipements' element={<SousEquipementsManagement />} />
      <Route path='/admin/elements' element={<ElementsManagement />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <PageTitle />
        <AppContent />
    </Router>
  );
};

export default App;
