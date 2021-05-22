import React from "react";
import './HomePartners.scss';
import LogoBinance from "../../../../assets/img/sections/home/logo-binance.svg";
import LogoWaves from "../../../../assets/img/sections/home/logo-waves.svg";
import LogoNeo from "../../../../assets/img/sections/home/logo-neo.svg";
import LogoEosPark from "../../../../assets/img/sections/home/logo-eospark.svg";
import LogoMeetOne from "../../../../assets/img/sections/home/logo-meet-one.svg";
import LogoRsk from "../../../../assets/img/sections/home/logo-rsk.svg";
import LogoOkex from "../../../../assets/img/sections/home/logo-okex.svg";
import LogoPoloniDex from "../../../../assets/img/sections/home/logo-polonidex.svg";
import LogoBestRate from "../../../../assets/img/sections/home/logo-best-rate.svg";
import LogoBancor from "../../../../assets/img/sections/home/logo-bancor.svg";

const HomePartners:React.FC=()=>{
  return(
    <div className='home-partners'>
      <div className='row'>
        <h2 className='h2 text-bold text-center'>Partners</h2>
        <div className='home-partners__container'>
          <div className='home-partners__partner'>
            <img src={LogoBinance} alt='rsk logo'/>
          </div>
          <div className='home-partners__partner'>
            <img src={LogoWaves} alt='rsk logo'/>
          </div>
          <div className='home-partners__partner'>
            <img src={LogoNeo} alt='neo logo'/>
          </div>
          <div className='home-partners__partner'>
            <img src={LogoEosPark} alt='eos logo'/>
          </div>
          <div className='home-partners__partner'>
            <img src={LogoMeetOne} alt='meet one logo'/>
          </div>
          <div className='home-partners__partner'>
            <img src={LogoRsk} alt='rsk logo'/>
          </div>
          <div className='home-partners__partner'>
            <img src={LogoOkex} alt='okex logo'/>
          </div>
          <div className='home-partners__partner'>
            <img src={LogoPoloniDex} alt='polonidex logo'/>
          </div>
          <div className='home-partners__partner'>
            <img src={LogoBestRate} alt='best rate logo'/>
          </div>
          <div className='home-partners__partner'>
            <img src={LogoBancor} alt='bancor logo'/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePartners;
