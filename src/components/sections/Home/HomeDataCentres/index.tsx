import React from 'react';
import { useTranslation } from 'react-i18next';
import nextId from 'react-id-generator';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ReactComponent as ArrowImg } from '../../../../assets/img/icons/swiper-arrow.svg';
import Img1 from '../../../../assets/img/sections/about/data/data-1.jpg';
import Img2 from '../../../../assets/img/sections/about/data/data-2.jpg';
import Img3 from '../../../../assets/img/sections/about/data/data-3.jpg';
import Img4 from '../../../../assets/img/sections/about/data/data-4.jpg';
import ShadowImg from '../../../../assets/img/sections/home/shadow.svg';

import './HomeDataCentres.scss';

SwiperCore.use([Navigation]);

const HomeDataCentres: React.FC = () => {
  const prevRef = React.useRef<HTMLDivElement>(null);
  const nextRef = React.useRef<HTMLDivElement>(null);
  const [swiperInst, setSwiperInst] = React.useState<any>(null);
  const [activeSlide, setActiveSlide] = React.useState<number>(1);

  const { t } = useTranslation();

  const slides = [
    {
      img: Img1,
      text: `${t('page.home.component.datacenters.slide.one')}`,
    },
    {
      img: Img2,
      text: `${t('page.home.component.datacenters.slide.two')}`,
    },
    {
      img: Img3,
      text: `${t('page.home.component.datacenters.slide.three')}`,
    },
    {
      img: Img4,
      text: `${t('page.home.component.datacenters.slide.four')}`,
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
        <h2 className="h2 text-bold home__data-title">
          {t('page.home.component.datacenters.title')}
        </h2>
        <div className="home__data-subtitle text">{t('page.home.component.datacenters.text')} </div>
        <div className="box-f home__data-content">
          <div className="home__data-text text-smd">
            {t('page.home.component.datacenters.text2')}
            <br />
            <br />
            {t('page.home.component.datacenters.text3')}
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
              prevEl: prevRef.current,
              nextEl: nextRef.current,
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
