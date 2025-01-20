import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login/login';
import Home from './Home/home';
import './App.css';

function App() {
  return (
    <div className='container'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home/:userId" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
