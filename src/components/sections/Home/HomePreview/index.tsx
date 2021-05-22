import React from 'react';

import { Button, Info } from '../../../atoms';

import './HomePreview.scss';

const HomePreview: React.FC = () => {
  return (
    <div className="home__preview">
      <div className="row row-md">
        <h1 className="h1 text-bold home__preview-title">Mine Bitcoin by staking BTCMT tokens</h1>
        <div className="text-lg home__preview-subtitle">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
          consequat duis enim velit mollit.
        </div>
        <div className="box-f box-f-ai-c home__preview-box">
          <Button size="lmd" className="home__preview-btn">
            <div className="text-upper text-slg">Stake</div>
          </Button>
          <Button size="md" colorScheme="outline" className="home__preview-btn">
            <div className="text-upper text-slg">Buy</div>
          </Button>
        </div>
        <div className="home__preview-info box-f box-f-ai-c">
          <Info content="$42" topText="Token Price" className="home__preview-info-item" />
          <Info
            content="9,2 M"
            topText="Total Supply"
            bottomText="BTCMT"
            className="home__preview-info-item"
          />
          <Info
            content="4,7 M"
            topText="Available"
            bottomText="BTCMT"
            className="home__preview-info-item"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePreview;
