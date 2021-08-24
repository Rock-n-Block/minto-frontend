import React from 'react';
import { useTranslation } from 'react-i18next';
import nextId from 'react-id-generator';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ReactComponent as ArrowImg } from '../../../../assets/img/icons/swiper-arrow.svg';
import NewsImg0 from '../../../../assets/img/sections/home/news-0.png';
import NewsImg1 from '../../../../assets/img/sections/home/news-1.png';
import NewsImg2 from '../../../../assets/img/sections/home/news-2.png';
import NewsImg3 from '../../../../assets/img/sections/home/news-3.png';
import NewsImg4 from '../../../../assets/img/sections/home/news-4.png';
import NewsImg5 from '../../../../assets/img/sections/home/news-5.png';
import NewsImg6 from '../../../../assets/img/sections/home/news-6.png';

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
      img: NewsImg6,
      date: 'August 19, 2021',
      title: 'BTCMT Presale Started',
      text: 'For all of thow who were planning to participate, now you can buy tokens that have simplified mining to a point beyond. For all of thow who were planning to participate, now you can buy tokens that have simplified mining to a point beyond. Stake it and receive a splendid mining reward!',
      link: {
        text: 'Purchase tokens',
        url: 'https://minto.finance/presale',
      },
    },
    {
      img: NewsImg5,
      date: 'August 18, 2021',
      title: 'Presale Guide',
      text: 'You decided to participate in the presale but don`t know where to begin? Here is a step-by-step guide on how to do it.',
      link: {
        text: 'Read on Medium',
        url: 'https://medium.com/@btcmtofficial/99874cf710d3',
      },
    },
    {
      img: NewsImg0,
      date: 'July 27, 2021',
      title: 'Audit Report',
      text: 'Hacken.io audit rated Minto Contract infrastructure on the top security level',
      link: {
        text: 'Read the Report',
        url: 'https://hacken.io/wp-content/uploads/2021/07/12072021_Minto_SC_Audit_Report.pdf',
      },
    },
    {
      img: NewsImg1,
      date: 'July 07, 2021',
      title: 'Telegram chat',
      text: 'We want to be in touch with you in the way it will be comfortable. Cryptocommunity and millions of people around the world love Telegram. The Minto team is not an exception.',
      link: {
        text: 'Follow the chat',
        url: 'https://t.me/btcmtofficialchat',
      },
    },
    {
      img: NewsImg2,
      date: 'July 05, 2021',
      title: 'Crypto Daily article',
      text: 'Here is an article about the current state of bitcoin mining. Sustainable future, ecology and origins. All the basic things and a modern opinion mentioning Minto.',
      link: {
        text: 'Read Crypto Daily',
        url: 'https://cryptodaily.co.uk/preview/52287',
      },
    },
    {
      img: NewsImg3,
      date: 'July 01, 2021',
      title: 'Medium',
      text: 'People love Medium as a platform for authors that allows them to comfortably share vision and thoughts. Our team has something to say too. Read our first article about the value for investors.',
      link: {
        text: 'Follow us',
        url: 'https://medium.com/@btcmtofficial/how-minto-gives-value-to-investors-8ea3c677616c?source=---------2----------------------------',
      },
    },
    {
      img: NewsImg4,
      date: 'June 29, 2021',
      title: 'Tokenomics',
      text: 'Our second article on Medium. Find out more about our vision on token and get details about how the economics of token works.',
      link: {
        text: 'Read about tokeonomics',
        url: 'https://medium.com/@btcmtofficial/minto-vision-and-tokenomics-6826ef75b1c4',
      },
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
            {Math.ceil(activeSlide / slidesPerGroud)}/{Math.ceil(slides.length / slidesPerGroud)}
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
              <a
                href={slide.link.url}
                target="_blank"
                rel="nofollow noreferrer"
                className="home__news-slide-link text-md"
              >
                {slide.link.text}
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeNews;
