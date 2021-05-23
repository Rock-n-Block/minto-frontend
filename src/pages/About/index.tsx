import React from 'react';
import 'swiper/swiper.scss';


import {About, Subscribe} from "../../components/organisms";
import {AboutContacts} from "../../components/sections";

const AboutPage: React.FC = ( ) => {
  return (
    <main className="about">
      <About />
      <AboutContacts/>
      <Subscribe/>
    </main>
  );
};

export default AboutPage;
