import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Login from './pages/login';
import Login from './pages/login';
import Home from './pages/home';

function App() {
  return (
    <BrowserRouter>
      <div className="App" >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div >
    </BrowserRouter>
  );
}

export default App;
