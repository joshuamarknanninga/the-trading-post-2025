// src/routes.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MapScreen from './components/MapScreen';
import WalletDashboard from './components/Wallet/WalletDashboard';
import TradingWrapped from './components/Wrapped/TradingWrapped';
import Profile from './pages/Profile';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/wallet" element={<WalletDashboard email="demo@tradingpost.com" />} />
        <Route path="/wrapped" element={<TradingWrapped email="demo@tradingpost.com" />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
