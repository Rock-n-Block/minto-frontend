import React from 'react';

import { About } from '../../components/organisms';
import { AboutContacts, AboutTeam } from '../../components/sections';

import 'swiper/swiper.scss';

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
