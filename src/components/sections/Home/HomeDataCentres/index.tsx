import React from 'react';
import nextId from 'react-id-generator';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ReactComponent as ArrowImg } from '../../../../assets/img/icons/swiper-arrow.svg';
import Img1 from '../../../../assets/img/sections/home/data-1.jpg';
import Img2 from '../../../../assets/img/sections/home/data-2.jpg';
import Img3 from '../../../../assets/img/sections/home/data-3.jpg';
import Img4 from '../../../../assets/img/sections/home/data-4.jpg';
import Img5 from '../../../../assets/img/sections/home/data-5.jpg';
import Img6 from '../../../../assets/img/sections/home/data-6.jpg';
import Img7 from '../../../../assets/img/sections/home/data-7.jpg';
import Img8 from '../../../../assets/img/sections/home/data-8.jpg';
import ShadowImg from '../../../../assets/img/sections/home/shadow.svg';

import './HomeDataCentres.scss';

SwiperCore.use([Navigation]);

const HomeDataCentres: React.FC = () => {
  const prevRef = React.useRef<HTMLDivElement>(null);
  const nextRef = React.useRef<HTMLDivElement>(null);
  const [swiperInst, setSwiperInst] = React.useState<any>(null);
  const [activeSlide, setActiveSlide] = React.useState<number>(1);
  const slides = [
    {
      img: Img1,
      text: 'The overall energy capacity is 64.5 MW and has been fitted with 3500 of the most advanced ASIC miners, with 50,000 THs of mining power allocated to Minto. Those figures will increase as the project grows.',
    },
    {
      img: Img2,
      text: 'The data center is powered by a private plant that provides it with cheap, green electricity.',
    },
    {
      img: Img3,
      text: "The facility's extra square footage opens up opportunities for further scaling at no additional cost.",
    },
    {
      img: Img4,
      text: 'The overall computing capabilities of the facility can be used for scientific calculations, processing big data, rendering and artificial intelligence.',
    },
    {
      img: Img5,
      text: 'Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.',
    },
    {
      img: Img6,
      text: 'Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.',
    },
    {
      img: Img7,
      text: 'Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.',
    },
    {
      img: Img8,
      text: 'Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.',
    },
  ];
  return (
    <div className="home__data">
      <img src={ShadowImg} alt="" className="home__data-shadow hidden-desktop" />
      <img
        src={ShadowImg}
        alt=""
        className="home__data-shadow home__data-shadow-bottom hidden-desktop"
      />
      <div className="row">
        <h2 className="h2 text-bold home__data-title">Our data centers</h2>
        <div className="home__data-subtitle text">
          We looked far and wide to find the perfect place to host our project; it had to be up to
          the highest international technological standards and it had to be capable of expanding as
          our project grew.{' '}
        </div>
        <div className="box-f home__data-content">
          <div className="home__data-text text-smd">
            Our project is hosted in a gem we found in the Republic of Karelia. The 86,000 square
            foot, brand new data center is in an ideal location that has enabled us to cut operation
            costs down to a minimum, thanks to a stable 1Gbit internet connection, smooth logistics
            and the suitable climate in the region.
            <br />
            <br />
            The facility and operation are in complete compliance with local and international
            regulations, and the site is maintained by a team of over 150 experienced technicians.
          </div>

          <div className="home__data-slider-nav box-f box-f-ai-c">
            <div
              ref={prevRef}
              className="home__data-slider-nav-prev swiper-navigation swiper-navigation-prev"
            >
              <ArrowImg />
            </div>
            <div className="text-green text-smd home__data-slider-nav-counter">
              {activeSlide}/{slides.length}
            </div>
            <div
              ref={nextRef}
              className="home__data-slider-nav-next swiper-navigation swiper-navigation-next"
            >
              <ArrowImg />
            </div>
          </div>
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            navigation={{
              prevEl: prevRef.current!,
              nextEl: nextRef.current!,
            }}
            onInit={(swiper) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              // eslint-disable-next-line no-param-reassign
              swiper.params.navigation.prevEl = prevRef.current;
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              // eslint-disable-next-line no-param-reassign
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.update();
              setSwiperInst(swiper);
            }}
            onSlideChangeTransitionEnd={() => {
              setActiveSlide(swiperInst.activeIndex + 1);
            }}
            className="home__data-slider"
            breakpoints={{
              768: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 'auto',
                spaceBetween: 20,
              },
            }}
          >
            {slides.map((slide, index) => (
              <SwiperSlide className="home__data-slide" key={nextId()}>
                <div className="home__data-slide-img">
                  <img src={slide.img} alt="" />
                </div>
                <div className="home__data-slide-content box-f">
                  <div className="home__data-slide-number box-f-c text-green text-lmd">
                    {index + 1}
                  </div>
                  <div className="home__data-slide-text text-smd">{slide.text}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HomeDataCentres;
