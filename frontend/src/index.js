import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Inscription from './components/inscription/Inscription';
import Login from './components/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>remboursement</Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>

  </React.StrictMode>
);
reportWebVitals();
