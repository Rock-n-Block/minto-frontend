import React from 'react';

import { About, Subscribe } from '../../components/organisms';
import {
  HomeDataCentres,
  HomeNews,
  HomePartners,
  HomePreview,
  HomeRoadmap,
} from '../../components/sections';

import 'swiper/swiper.scss';

const Home: React.FC = () => {
  return (
    <main className="home">
      <HomePreview />
      <About />
      <HomeDataCentres />
      <Subscribe />
      <HomePartners />
      <HomeRoadmap />
      <HomeNews />
    </main>
  );
};

export default Home;
