import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import PageA from './PageA';
import PageB from './PageB';
import PageC from './PageC';
import PageD from './PageD';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page-a" element={<PageA />} />
        <Route path="/page-b" element={<PageB />} />
        <Route path="/page-c" element={<PageC />} />
        <Route path="/page-d" element={<PageD />} />
      </Routes>
    </Router>
  );
}

export default App;
