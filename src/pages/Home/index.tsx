import React from 'react';

import './Home.scss';
import 'swiper/swiper.scss';

import {
  HomeAbout,
  HomePreview,
  HomeDataCentres,
  HomeSubscribe,
  HomePartners,
  HomeRoadmap,
  HomeLinks
} from '../../components/sections';

const Home: React.FC = () => {
  return (
    <main className="home">
      <HomePreview />
      <HomeAbout />
      <HomeDataCentres />
      <HomeSubscribe />
      <HomePartners />
      <HomeRoadmap />
      <HomeLinks />
    </main>
  );
};

export default Home;
