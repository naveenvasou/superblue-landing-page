import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WebHero from './web-integration/WebHero';
import WebFeatures from './web-integration/WebFeatures';
import WebUseCases from './web-integration/WebUseCases';
import WebDeployment from './web-integration/WebDeployment';
import WebCTA from './web-integration/WebCTA';

const WebIntegrationPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white font-outfit">
            {/* Reusing existing Navbar structure which handles its own fixed positioning */}
            {/* Note: Navbar is usually outside in <App> but based on App.tsx structure, it's global layout. 
          However, usually specific landing pages might want specific layouts. 
          Looking at App.tsx, Navbar is global. So I don't need to include it here if the Route renders inside Layout. 
          
          Let's re-read App.tsx content from memory/previous turn.
          App.tsx renders <Navbar /> then <Routes>.
          So I just need to render the content sections.
      */}

            <main>
                <WebHero />
                <WebFeatures />
                <WebUseCases />
                <WebDeployment />
                <WebCTA />
            </main>
        </div>
    );
};

export default WebIntegrationPage;
