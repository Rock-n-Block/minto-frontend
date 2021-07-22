import React from 'react';

import { About } from '../../components/organisms';
import { HomeNews, HomePartners, HomePreview } from '../../components/sections';

import 'swiper/swiper.scss';
import './Home.scss';

const Home: React.FC = () => {
  return (
    <main className="home">
      <HomePreview />
      <div
        className="typeform-widget home__form"
        data-url="https://form.typeform.com/to/TvDKWGwN?typeform-medium=embed-snippet"
      />
      <About />
      {/* <Subscribe /> */}
      <HomePartners />
      {/* <HomeRoadmap /> */}
      <HomeNews />
    </main>
  );
};

export default Home;
