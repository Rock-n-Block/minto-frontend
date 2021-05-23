import React from 'react';

import 'swiper/swiper.scss';

import {
  HomePreview,
  HomeDataCentres,
  HomePartners,
  HomeRoadmap,
  HomeLinks,
  HomeNews,
} from '../../components/sections';
import { Subscribe, About } from '../../components/organisms';

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
      <HomeLinks />
    </main>
  );
};

export default Home;
