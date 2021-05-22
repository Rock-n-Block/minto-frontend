import React from "react";
import './HomeLinks.scss'
import Twitter from '../../../../assets/img/icons/twitter.svg';
import Medium from '../../../../assets/img/icons/medium.svg';
import Github from '../../../../assets/img/icons/github.svg';
import Telegram from '../../../../assets/img/icons/telegram.svg';
import {Button, Input} from "../../../atoms";

const HomeLinks: React.FC = () => {
  return (
    <div className='home-links'>
      <div className='row '>
        <div className='home-links__link link__subscribe'>
          <h3 className='home-links__title text-center text text-white text-bold-e'>
            Subscribe
          </h3>
          <div className='link__subscribe__social-networks'>
            <a href='/#' className='link__subscribe__network circle box-f-c'>
              <img src={Twitter} alt='Twitter'/>
            </a>
            <a href='/#' className='link__subscribe__network circle box-f-c'>
              <img src={Medium} alt='Medium'/>
            </a>
            <a href='/#' className='link__subscribe__network circle box-f-c'>
              <img src={Github} alt='Github'/>
            </a>
          </div>
        </div>
        <div className='home-links__link link__subscribe-email'>
          <h3 className='home-links__title text-center text text-white text-bold-e'>
            Subscribe to the news by email
          </h3>
          <div  className="link__subscribe-email__e-mail input-container">
            <Input placeholder='Enter your email' shadow/>
          </div>
          <Button size='smd' colorScheme="green" className='link__subscribe-email__submit-btn'>
          <span className="text-upper text-bold-e text-smd">
            Subscribe
          </span>
          </Button>
        </div>
        <div className='home-links__link link__chat'>
          <h3 className='home-links__title text-center text text-white text-bold-e'>
            Talk to the team and like-minded people
          </h3>
          <a href='/#' className='link__chat-tg circle box-f-c'>
            <img src={Telegram} alt='Telegram'/>
          </a>
        </div>
      </div>
    </div>
  )
}

export default HomeLinks;
