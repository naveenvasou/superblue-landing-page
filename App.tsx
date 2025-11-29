
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import WaitlistPage from './components/WaitlistPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white relative">
        {/* Background container for the whole page to ensure smoothness */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-white" />

        <Navbar />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/waitlist" element={<WaitlistPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
