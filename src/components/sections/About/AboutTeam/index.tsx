import React from 'react';
import nextId from 'react-id-generator';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ReactComponent as ArrowImg } from '../../../../assets/img/icons/swiper-arrow.svg';
import WillWarren from '../../../../assets/img/sections/about/employees/will-warren.png';
import { TeamCard } from '../../../atoms';
import { ITeamCard } from '../../../atoms/TeamCard';

import './AboutTeam.scss';

const employees: Array<ITeamCard> = [
  {
    photo: WillWarren,
    name: 'Will Warren',
    position: 'Co-founder & CEO',
  },
  {
    photo: WillWarren,
    name: 'Lawrence Forman',
    position: 'Workplace Experience Specialist',
  },
  {
    photo: WillWarren,
    name: 'Will Warren',
    position: 'Co-founder & CEO',
  },
  {
    photo: WillWarren,
    name: 'Will Warren',
    position: 'Co-founder & CEO',
  },
  {
    photo: WillWarren,
    name: 'Will Warren',
    position: 'Co-founder & CEO',
  },
  {
    photo: WillWarren,
    name: 'Will Warren',
    position: 'Co-founder & CEO',
  },
  {
    photo: WillWarren,
    name: 'Will Warren',
    position: 'Co-founder & CEO',
  },
  {
    photo: WillWarren,
    name: 'Will Warren',
    position: 'Co-founder & CEO',
  },
  {
    photo: WillWarren,
    name: 'Will Warren',
    position: 'Co-founder & CEO',
  },
];

SwiperCore.use([Navigation]);

const AboutTeam: React.FC = () => {
  const prevRef = React.useRef<HTMLDivElement>(null);
  const nextRef = React.useRef<HTMLDivElement>(null);
  const [swiperInst, setSwiperInst] = React.useState<any>(null);
  const [activeSlide, setActiveSlide] = React.useState<number>(3);
  let slidesPerGroud = 1;
  if (window.innerWidth > 869) {
    slidesPerGroud = 3;
  } else if (window.innerWidth > 619) {
    slidesPerGroud = 2;
  }
  return (
    <div className="about-team">
      <div className="row">
        <h2 className="h2 text-bold">Team</h2>
        <div className="about-team__cards about-team__cards-desktop">
          {employees.map((employee) => (
            <TeamCard
              photo={employee.photo}
              name={employee.name}
              position={employee.position}
              key={nextId()}
            />
          ))}
        </div>
        <div className="about-team__cards about-team__cards-mobile">
          <div className="about-team-slider-nav box-f box-f-c">
            <div
              ref={prevRef}
              className="about-team-slider-nav-prev swiper-navigation swiper-navigation-prev"
            >
              <ArrowImg />
            </div>
            <div className="text-green text-smd home__data-slider-nav-counter">
              {activeSlide === employees.length
                ? Math.round(employees.length / slidesPerGroud)
                : Math.floor(activeSlide / slidesPerGroud)}
              /{Math.round(employees.length / slidesPerGroud)}
            </div>
            <div
              ref={nextRef}
              className="about-team-slider-nav-next swiper-navigation swiper-navigation-next"
            >
              <ArrowImg />
            </div>
          </div>
          <Swiper
            slidesPerView={1}
            slidesPerGroup={1}
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
            className="about-team-slider"
            breakpoints={{
              620: {
                slidesPerView: 2,
                slidesPerGroup: 2,
              },
              870: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
            }}
          >
            {employees.map((employee) => (
              <SwiperSlide key={nextId()} className="about-team-slide">
                <TeamCard
                  photo={employee.photo}
                  name={employee.name}
                  position={employee.position}
                  key={nextId()}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default AboutTeam;
