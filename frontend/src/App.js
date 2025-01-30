import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Login from './pages/login';
import Login from './pages/login';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import HomeLogin from './pages/home-login';

function App() {
  return (
    <BrowserRouter>
      <div className="App" >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home-login" element={<HomeLogin />} />
        </Routes>
      </div >
    </BrowserRouter>
  );
}

export default App;
