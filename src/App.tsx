import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Overview from './pages/Overview';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';

/**
 * Nova Enterprise HQ - Root Entry
 * @description Configures the router, injects the global layout, RBAC Auth Provider, and route guards.
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <DashboardLayout>
          <Routes>
            {/* --- PUBLIC ZONE (Accessible by authorized dashboard users) --- */}
            <Route path="/" element={<Overview />} />
            <Route path="/inventory" element={<Inventory />} />

            {/* --- RESTRICTED ZONE (Protected Routes) --- */}
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute allowedRoles={['President']}>
                  <Orders />
                </ProtectedRoute>
              } 
            />
            
            {/* Future routes will be guarded similarly */}
          </Routes>
        </DashboardLayout>
      </Router>
    </AuthProvider>
  );
};

export default App;