import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Login from './pages/login';
import Login from './pages/login';
import Home from './pages/home';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="App" >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div >
    </BrowserRouter>
  );
}

export default App;
