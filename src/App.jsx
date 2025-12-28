import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LogExcretion from './pages/LogExcretion';
import LogMood from './pages/LogMood';
import LogMedicine from './pages/LogMedicine';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log/excretion" element={<LogExcretion />} />
        <Route path="/log/mood" element={<LogMood />} />
        <Route path="/log/medicine" element={<LogMedicine />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
