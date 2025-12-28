import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LogExcretion from './pages/LogExcretion';
import LogMood from './pages/LogMood';
import LogMedicine from './pages/LogMedicine';
import LogWeight from './pages/LogWeight';
import LogFood from './pages/LogFood';
import Settings from './pages/Settings';
import History from './pages/History';
import EditLog from './pages/EditLog';
import Charts from './pages/Charts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log/excretion" element={<LogExcretion />} />
        <Route path="/log/mood" element={<LogMood />} />
        <Route path="/log/medicine" element={<LogMedicine />} />
        <Route path="/log/food" element={<LogFood />} />
        <Route path="/log/weight" element={<LogWeight />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<History />} />
        <Route path="/edit/:id" element={<EditLog />} />
        <Route path="/charts" element={<Charts />} />
      </Routes>
    </Router>
  );
}

export default App;
