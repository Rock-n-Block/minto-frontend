import React from 'react';

import './Home.scss';

import { Button } from '../../components/atoms';

const Home: React.FC = () => {
  return (
    <div className="home">
      <main>
        <Button>
          <div className="text-upper text-bold text-slg">Stake</div>
        </Button>
      </main>
    </div>
  );
};

export default Home;
