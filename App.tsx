
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceSection from './components/ExperienceSection';
import FeaturesSection from './components/FeaturesSection';
import UseCasesSectionV3 from './components/UseCasesSectionV3';
import ScaleSection from './components/ScaleSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Background container for the whole page to ensure smoothness */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-white" />

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <ExperienceSection />
        <FeaturesSection />
        <UseCasesSectionV3 />
        <ScaleSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
