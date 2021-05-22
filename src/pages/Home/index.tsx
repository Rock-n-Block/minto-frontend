import React from 'react';

import './Home.scss';

import {HomeAbout, HomePreview} from '../../components/sections';

const Home: React.FC = () => {
  return (
    <main className="home">
      <HomePreview />
      <HomeAbout/>
    </main>
  );
};

export default Home;
