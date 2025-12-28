import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Placeholder pages (will replace later)
import Home from './pages/Home';
import LogMedicine from './pages/LogMedicine';
import LogExcretion from './pages/LogExcretion';
import LogMood from './pages/LogMood';
import LogWeight from './pages/LogWeight';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="log/medicine" element={<LogMedicine />} />
          <Route path="log/excretion" element={<LogExcretion />} />
          <Route path="log/mood" element={<LogMood />} />
          <Route path="log/weight" element={<LogWeight />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
