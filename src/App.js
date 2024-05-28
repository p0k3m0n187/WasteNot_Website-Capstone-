import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './Pages/Login';
import { Register } from './Pages/Register';
import { Profile } from './Pages/Profile';
import { Homepage } from './Pages/HomePage';
import { Staff } from './Pages/Staff';
import { Menu } from './Pages/Menu';
import { Inventory } from './Pages/Inventory';
import { Market } from './Pages/Market';
import { AddStaff } from './Pages/AddStaff';
import { AddDish } from './Pages/AddDish';
import { AboutUs } from './components/AboutUs';
import { Homepage2 } from './Pages/HomePage2';
import { AuthProvider } from './components/Auth/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/market" element={<Market />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/addstaff" element={<AddStaff />} />
            <Route path="/addDish" element={<AddDish />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/homepage2" element={<Homepage2 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;