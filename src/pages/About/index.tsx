import React from 'react';
import 'swiper/swiper.scss';

import { About } from '../../components/organisms';
import { AboutContacts, AboutTeam } from '../../components/sections';

const AboutPage: React.FC = () => {
  return (
    <main className="about-page">
      <About />
      <AboutContacts />
      <AboutTeam />
    </main>
  );
};

export default AboutPage;
