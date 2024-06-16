import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Link to="/page-a" className="arrow arrow-up">↑</Link>
      <Link to="/page-b" className="arrow arrow-left">←</Link>
      <Link to="/page-c" className="arrow arrow-right">→</Link>
      <Link to="/page-d" className="arrow arrow-down">↓</Link>
    </div>
  );
}

export default Home;
