import React from 'react';

import { About } from '../../components/organisms';
import { HomeNews, HomePartners, HomePreview } from '../../components/sections';

import 'swiper/swiper.scss';

const Home: React.FC = () => {
  return (
    <main className="home">
      <HomePreview />
      <About />
      {/* <Subscribe /> */}
      <HomePartners />
      {/* <HomeRoadmap /> */}
      <HomeNews />
    </main>
  );
};

export default Home;
