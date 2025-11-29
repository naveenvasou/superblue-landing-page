import React from 'react';
import Hero from './Hero';
import StatsSection from './StatsSection';
import ExperienceSection from './ExperienceSection';
import FeaturesSection from './FeaturesSection';
import UseCasesSectionV3 from './UseCasesSectionV3';
import ScaleSection from './ScaleSection';
import CTASection from './CTASection';

const LandingPage: React.FC = () => {
    return (
        <>
            <Hero />
            <StatsSection />
            <ExperienceSection />
            <FeaturesSection />
            <UseCasesSectionV3 />
            <ScaleSection />
            <CTASection />
        </>
    );
};

export default LandingPage;
