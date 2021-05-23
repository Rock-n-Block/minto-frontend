import React from 'react';

import './Home.scss';
import 'swiper/swiper.scss';

import {
  HomePreview,
  HomeDataCentres,
  HomePartners,
  HomeRoadmap,
  HomeLinks,
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
      <HomeLinks />
    </main>
  );
};

export default Home;
