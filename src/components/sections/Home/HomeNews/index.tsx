import React from 'react';
import { useTranslation } from 'react-i18next';
import nextId from 'react-id-generator';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ReactComponent as ArrowImg } from '../../../../assets/img/icons/swiper-arrow.svg';
import NewsImg1 from '../../../../assets/img/sections/home/news-1.jpg';
import NewsImg2 from '../../../../assets/img/sections/home/news-2.jpg';
import NewsImg3 from '../../../../assets/img/sections/home/news-3.jpg';

import './HomeNews.scss';

SwiperCore.use([Navigation]);

const HomeNews: React.FC = () => {
  const prevRef = React.useRef<HTMLDivElement>(null);
  const nextRef = React.useRef<HTMLDivElement>(null);
  const [swiperInst, setSwiperInst] = React.useState<any>(null);
  const [activeSlide, setActiveSlide] = React.useState<number>(3);

  const { t } = useTranslation();

  const slidesPerGroud = window.innerWidth > 768 ? 3 : 1;
  const slides = [
    {
      img: NewsImg1,
      date: 'March 24, 2021',
      title: 'CryptoUniverse spring update',
      text: 'We could not wait to present you the first part of the huge transformation. CryptoUniverse',
    },
    {
      img: NewsImg2,
      date: 'March 9, 2021',
      title: 'March 9th Maintenance',
      text: 'Dear users,   We had update-related maintenance today. It took some time for our provider to complete',
    },
    {
      img: NewsImg3,
      date: 'February 12, 2021',
      title: 'Crypto Valentine’s Day - Happy 4 CryptoUniverse Birthday',
      text: 'CryptoUniverse was born on Valentine’s day, so everything we do is filled with love with',
    },
    {
      img: NewsImg1,
      date: 'March 24, 2021',
      title: 'CryptoUniverse spring update',
      text: 'We could not wait to present you the first part of the huge transformation. CryptoUniverse',
    },
    {
      img: NewsImg2,
      date: 'March 9, 2021',
      title: 'March 9th Maintenance',
      text: 'Dear users,   We had update-related maintenance today. It took some time for our provider to complete',
    },
    {
      img: NewsImg3,
      date: 'February 12, 2021',
      title: 'Crypto Valentine’s Day - Happy 4 CryptoUniverse Birthday',
      text: 'CryptoUniverse was born on Valentine’s day, so everything we do is filled with love with',
    },
  ];
  return (
    <div className="home__news">
      <div className="row home__news-row">
        <h2 className="h2 text-bold home__news-title">{t('page.home.component.news.title')}</h2>
        <div className="home__news-slider-nav box-f box-f-ai-c">
          <div
            ref={prevRef}
            className="home__data-slider-nav-prev swiper-navigation swiper-navigation-prev"
          >
            <ArrowImg />
          </div>
          <div className="text-green text-smd home__data-slider-nav-counter">
            {activeSlide / slidesPerGroud}/{slides.length / slidesPerGroud}
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
          slidesPerGroup={1}
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
            setActiveSlide(swiperInst.activeIndex + slidesPerGroud);
          }}
          className="home__news-slider"
          breakpoints={{
            768: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 47,
            },
          }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={nextId()} className="home__news-slide">
              <div className="home__news-slide-img box-f-c">
                <img src={slide.img} alt="" />
              </div>
              <div className="home__news-slide-date text-gray text-sm text-upper box-f-ai-c">
                <span>{slide.date}</span>
              </div>
              <div className="home__news-slide-title text text-bold-e">{slide.title}</div>
              <div className="home__news-slide-text text-md">{slide.text}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeNews;
