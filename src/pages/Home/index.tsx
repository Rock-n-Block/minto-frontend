import React from 'react';

import './Home.scss';

import { HomePreview } from '../../components/sections';

const Home: React.FC = () => {
  return (
    <main className="home">
      <HomePreview />
    </main>
  );
};

export default Home;
