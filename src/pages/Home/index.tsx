import React from 'react';

import './Home.scss';
import 'swiper/swiper.scss';

import { HomePreview, HomeDataCentres } from '../../components/sections';

const Home: React.FC = () => {
  return (
    <main className="home">
      <HomePreview />
      <HomeDataCentres />
    </main>
  );
};

export default Home;
