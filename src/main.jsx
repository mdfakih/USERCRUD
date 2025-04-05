import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import App from './App.jsx';
import UserDetails from './components/UserDetails.jsx';
import CreateUserPage from './components/CreateUserPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<App />}
        />
        <Route
          path="/details/:id"
          element={<UserDetails />}
        />
        <Route
          path="/create-user"
          element={<CreateUserPage />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
