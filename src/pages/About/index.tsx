import React from 'react';

import { About } from '../../components/organisms';
import { AboutContacts, HomeDataCentres } from '../../components/sections';

import 'swiper/swiper.scss';

const AboutPage: React.FC = () => {
  return (
    <main className="about-page">
      <About />
      <AboutContacts />
      {/* <AboutTeam /> */}
      <HomeDataCentres />
    </main>
  );
};

export default AboutPage;
