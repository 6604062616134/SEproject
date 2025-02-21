import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Login from './pages/login';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import HomeLogin from './pages/home-login';
import Return from './pages/return';
import History from './pages/history';

function App() {
  return (
    <BrowserRouter>
      <div className="App" >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home-login" element={<HomeLogin />} />
          <Route path="/return" element={<Return />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div >
    </BrowserRouter>
  );
}

export default App;
