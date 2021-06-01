import React from 'react';
import nextId from 'react-id-generator';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ReactComponent as ArrowImg } from '../../../../assets/img/icons/swiper-arrow.svg';
import RoadArrowImg from '../../../../assets/img/sections/home/roadmap-arrow.svg';
import LineBigImg from '../../../../assets/img/sections/home/roadmap-line-b.svg';
import LineImg from '../../../../assets/img/sections/home/roadmap-line.svg';

import './HomeRoadmap.scss';

SwiperCore.use([Navigation]);

const HomeRoadmap: React.FC = () => {
  const prevRef = React.useRef<HTMLDivElement>(null);
  const nextRef = React.useRef<HTMLDivElement>(null);
  const [swiperInst, setSwiperInst] = React.useState<any>(null);
  const [activeSlide, setActiveSlide] = React.useState<number>(1);
  const slides = [
    {
      year: 2021,
      items: [
        'Techincal Improvements',
        'Websockets',
        'SushiSwap Integration',
        'Multiexchange Suport',
        'Velox Bots and LimitOrders Integration',
        'UX/UI Redesign',
      ],
    },
    {
      year: 2021,
      items: [
        'NFT marketing promotion tool',
        'Presale promotion tools',
        'More tools (mempool, analytics...)',
        'Improvements based on community feedback',
      ],
    },
    {
      year: 2021,
      items: ['CEX tools', 'Advanced public API release', 'More dex integration'],
    },
    {
      year: 2021,
      items: ['CEX tools', 'Advanced public API release', 'More dex integration'],
    },
  ];
  return (
    <div className="home__roadmap">
      <div className="row">
        <h2 className="home__roadmap-title h2 text-bold">Roadmap</h2>
        <div className="home__roadmap-slider-nav box-f box-f-ai-c">
          <div
            ref={prevRef}
            className="home__data-slider-nav-prev swiper-navigation swiper-navigation-prev"
          >
            <ArrowImg />
          </div>
          <div className="text-green text-smd home__data-slider-nav-counter hidden-desktop">
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
          slidesPerView="auto"
          spaceBetween={90}
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
          className="home__roadmap-slider"
          breakpoints={{
            768: {
              slidesPerView: 'auto',
              spaceBetween: 90,
            },
            1024: {
              slidesPerView: 'auto',
              spaceBetween: 150,
            },
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide className="home__roadmap-slide" key={nextId()}>
              {index + 1 !== slides.length ? (
                <img src={RoadArrowImg} alt="" className="home__roadmap-slide-arrow" />
              ) : (
                ''
              )}
              <div className="home__roadmap-slide-number text-green text-smd text-bold">
                Q{index + 1}
              </div>
              <div className="home__roadmap-slide-year text-bold h3">{slide.year}</div>
              {index % 3 === 0 ? (
                <img src={LineBigImg} alt="" className="home__roadmap-slide-line" />
              ) : (
                <img src={LineImg} alt="" className="home__roadmap-slide-line" />
              )}
              {slide.items.map((item, i) => {
                return (
                  <div className="home__roadmap-slide-info box-f box-f-ai-c" key={nextId()}>
                    <div className="home__roadmap-slide-info-num text-green">
                      {i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </div>
                    <div className="home__roadmap-slide-info-text text-smd">{item}</div>
                  </div>
                );
              })}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeRoadmap;
