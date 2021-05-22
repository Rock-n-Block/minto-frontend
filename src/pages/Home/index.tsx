import React from 'react';

import './Home.scss';
import 'swiper/swiper.scss';

import { HomeAbout, HomePreview, HomeDataCentres } from '../../components/sections';

const Home: React.FC = () => {
  return (
    <main className="home">
      <HomePreview />
      <HomeAbout />
      <HomeDataCentres />
    </main>
  );
};

export default Home;
