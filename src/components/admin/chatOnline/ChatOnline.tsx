import React from 'react';
import './chatOnline.css';
import { WanderLuxeLogoWithBG } from '../../../assets/extraImages';

const ChatOnline: React.FC = () => {
 
  return (
   <div className="chatOnline">
    <div className="chatOnlineUser">
      <div className="chatOnlineImgContainer">
        <img className='chatOnlineImg' src={WanderLuxeLogoWithBG} alt=''/>
      <div className="chatOnlineBadge"></div>
      </div>
    <span className="chatOnlineName">John Doe</span>
    </div>

    {/* Dummy  */}
    <div className="chatOnlineUser">
      <div className="chatOnlineImgContainer">
        <img className='chatOnlineImg' src={WanderLuxeLogoWithBG} alt=''/>
      <div className="chatOnlineBadge"></div>
      </div>
    <span className="chatOnlineName">John Doe</span>
    </div>
    <div className="chatOnlineUser">
      <div className="chatOnlineImgContainer">
        <img className='chatOnlineImg' src={WanderLuxeLogoWithBG} alt=''/>
      <div className="chatOnlineBadge"></div>
      </div>
    <span className="chatOnlineName">John Doe</span>
    </div>
    <div className="chatOnlineUser">
      <div className="chatOnlineImgContainer">
        <img className='chatOnlineImg' src={WanderLuxeLogoWithBG} alt=''/>
      <div className="chatOnlineBadge"></div>
      </div>
    <span className="chatOnlineName">John Doe</span>
    </div>
   </div>
   
  );
};

export default ChatOnline;