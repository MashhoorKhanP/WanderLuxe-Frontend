// import React, { useEffect, useState } from 'react';
// import './chatOnline.css';
// import { WanderLuxeLogoWithBG } from '../../../assets/extraImages';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../store/types';

// interface ChatOnlineProps{
//   onlineUsers:any,
//   currentUserId?:any,
//   setCurrentChat?:any,
// }

// const ChatOnline: React.FC<ChatOnlineProps> = ({onlineUsers,currentUserId,setCurrentChat}) => {
//   const [users,setUsers] = useState<any>([]);
//   const [isonlineUsers,setIsOnlineUsers] = useState<any>([]);
//   const allUsers = useSelector((state: RootState) => state.admin.users);
//   useEffect(() => {
//     setUsers(allUsers);
    
//   },[])
//   console.log('users', users);
//   console.log('onlineUsers', onlineUsers);

//   useEffect(() => {
//     setIsOnlineUsers(users.filter((user:any) => onlineUsers.includes(user?._id)));
//   },[users,onlineUsers]);
//   console.log('isonlineUsers', isonlineUsers);
//   return (
//    <div className="chatOnline">
//     {isonlineUsers.map((onlineUser:any) =>(
//     <div className="chatOnlineUser">
//       <div className="chatOnlineImgContainer">
//         <img className='chatOnlineImg' src={onlineUser?.profileImage} alt=''/>
//       <div className="chatOnlineBadge"></div>
//       </div>
//     <span className="chatOnlineName">{`${onlineUser?.firstName} ${onlineUser?.lastName}`}</span>
//     </div>
//     ))}
//    </div>
   
//   );
// };

// export default ChatOnline;