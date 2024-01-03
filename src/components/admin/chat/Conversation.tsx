import React, { useEffect, useState } from 'react';
import './conversation.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/types';

interface ConversationProps{
  conversation:[]| any;
  currentAdminId:string;
}

const Conversation: React.FC<ConversationProps> = ({conversation,currentAdminId}) => {

  const allUsers = useSelector((state: RootState) => state.admin.users);
  console.log('users',allUsers)
  const [users,setUsers] = useState<any>(null);

  useEffect (() => {
    const userId = conversation.members.find((member:any) => member !== currentAdminId );
    const usersData = allUsers.find((user:any) => user._id === userId);
    console.log('user',usersData);
    setUsers(usersData);
  },[currentAdminId,conversation])
 
  return (
    <div className='conversation'>
       {users?.profileImage ? (
         <img className='conversationImg' src={users?.profileImage} alt="Profile" />
  ) : (
    <div className='conversationImgNoImage'>
      {users?.firstName.charAt(0).toUpperCase()}
    </div>
  )}
      <span className="conversationName">{`${users?.firstName} ${users?.lastName}`}</span>
    </div>
  );
};

export default Conversation;