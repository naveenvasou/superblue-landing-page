
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import WaitlistPage from './components/WaitlistPage';
import WebIntegrationPage from './components/WebIntegrationPage';
import EcomDemoPage from './components/EcomDemoPage';

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
            <Route path="/web" element={<WebIntegrationPage />} />
            <Route path="/ecom-demo" element={<EcomDemoPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
