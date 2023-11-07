import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App'; 
import reportWebVitals from './reportWebVitals';
import Connexion from './Connexion';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/App" element={<App />}>
          remboursement
        </Route>
        <Route path="/Connexion" element={<Connexion />}>
          remboursement
        </Route>
       </Routes>
    </BrowserRouter>
   
  </React.StrictMode>
);
reportWebVitals();
