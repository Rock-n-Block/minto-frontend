import React from 'react';

import './Home.scss';

import { HomePreview } from '../../components/sections';

const Home: React.FC = () => {
  return (
    <div className="home">
      <main>
        <HomePreview />
      </main>
    </div>
  );
};

export default Home;
