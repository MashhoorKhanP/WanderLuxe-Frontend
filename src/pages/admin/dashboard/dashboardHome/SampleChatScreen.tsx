// import React, { useEffect, useRef, useState } from 'react';
// import useCheckToken from '../../../../components/hooks/useCheckToken';
// import { useDispatch, useSelector } from 'react-redux';
// import './chatScreen.css'
// import { TextField } from '@mui/material';
// import Conversation from '../../../../components/admin/chat/Conversation';
// import Message from '../../../../components/admin/chatMessage/Message';
// import { KeyboardDoubleArrowDownOutlined, Send } from '@mui/icons-material';
// import ChatOnline from '../../../../components/admin/chatOnline/ChatOnline';
// import { useLocation } from 'react-router-dom';
// import { RootState } from '../../../../store/types';
// import { addNewMessage, getAdminConversations, getMessages } from '../../../../actions/chat';
// import { AppDispatch } from '../../../../store/store';
// import { LoadingGif} from '../../../../assets/extraImages';
// import { Socket, io } from 'socket.io-client';
// import { setNewMessages } from '../../../../store/slices/adminSlices/adminSlice';

// interface ChatProps {
//   setSelectedLink?: React.Dispatch<React.SetStateAction<string>>;
//   link?: string;
// }

// const ChatScreen: React.FC<ChatProps> = ({ setSelectedLink, link }) => {
//   const checkToken = useCheckToken();
//   const location = useLocation();
//   const dispatch = useDispatch<AppDispatch>();
//   let currentAdmin:any;
//   let currentUser:any;

//   if (location.pathname === '/admin/dashboard/chat-screen') {
//     ({ currentAdmin } = useSelector((state: RootState) => state.admin));
//   } else {
//     ({ currentUser } = useSelector((state: RootState) => state.user));
//   }
//   const [conversations,setConversations] = useState([]);
//   const [currentChat, setCurrentChat] = useState<any>(null);
//   const [messages,setMessages] = useState<any>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [arrivalMessage, setArrivalMessage] = useState<any>(null);
//   const [userId,setUserId] = useState('');
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const socket = useRef<Socket | null>();

//   useEffect(()=>{
//     if(!socket.current){
//       socket.current = io(import.meta.env.VITE_SERVER_URL)
//       socket.current.emit('addUser',(location.pathname == '/admin/dashboard/chat-screen'?currentAdmin?._id:currentUser?._id))
//       socket.current.on('getUser',(data)=>{
//         console.log('Socket Users from Chat screen',data);
//       })

//       socket.current?.on('getMessage',(data) => {
//         setArrivalMessage({
//           sender:data.senderId,
//           text: data.text,
//           createdAt:Date.now()
//         })

//         console.log('data arrival',data);
//       })
      
//     }
//   },[socket])

//   useEffect(() => {
//     arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && 
//     setMessages((prev:any) => [...prev,arrivalMessage])

//   },[arrivalMessage,currentChat])
 
  
//   useEffect(() => {
//     if(location.pathname==='/admin/dashboard/chat-screen'){
//       setUserId(currentAdmin?._id)
//     }else{
//       setUserId(currentUser?._id);
//     }
//   },[currentAdmin,currentUser])


//   useEffect(() => {
//     if (location.pathname !=='/admin/dashboard/chat-screen' && conversations.length > 0 && !currentChat) {
//       setTimeout(()=> {
//         setCurrentChat(conversations[0]);
        
//       },500)
//     }
//     dispatch(setNewMessages(messages.length))
//   }, [location.pathname, conversations, currentChat]);

//   useEffect(() => {
//       if(location.pathname == '/admin/dashboard/chat-screen'){
//       const response = dispatch(getAdminConversations(currentAdmin?._id))
//       const responseUnwrapped = response.unwrap();
//       responseUnwrapped.then((thenResponse) => {
//         console.log("thenResponse", thenResponse.message.conv);
//         setConversations(thenResponse.message.conv)
//       });
//       }else{
//         const response = dispatch(getAdminConversations(currentUser?._id))
//         const responseUnwrapped = response.unwrap();
//         responseUnwrapped.then((thenResponse) => {
//           console.log("thenResponse", thenResponse.message.conv);
//           setConversations(thenResponse.message.conv)
//         });
//       }
      
//     },[userId])

//   useEffect(() => {
//     const response = dispatch(getMessages(currentChat?._id))
//     const responseUnwrapped = response.unwrap();
//     responseUnwrapped.then((thenResponse) => {
//       console.log("thenResponseMessage", thenResponse.message);
//       setMessages(thenResponse.message)
      
//     });
//   },[currentChat])
  
//   console.log('currentChat', currentChat)
//   console.log('userId', userId)


//   useEffect(() => {
//     if(setSelectedLink && link){
//       setSelectedLink(link);
//     }
    
//     // Dispatch the action to fetch users when the component mounts
//   }, [dispatch, setSelectedLink, link]);

//   checkToken
//   useEffect(() => {
    
//     const goDownButton = document.querySelector('.goDownButton') || document.querySelector('.goDownButtonUser');
//     const chatBoxTop = document.querySelector('.chatBoxTop');
//     if (goDownButton && chatBoxTop) {
//       goDownButton.addEventListener('click', function() {
//         chatBoxTop.scrollTop = chatBoxTop.scrollHeight;
//       });
//     }

//     return () => {
//       if (goDownButton) {
//         goDownButton.removeEventListener('click', () => {});
//       }
//     };
//  }, []);

//  const chatBoxTopRef = useRef<HTMLDivElement>(null);
//  const goDownButtonRef = useRef<HTMLButtonElement>(null);


//  const showGoDownButton = () => {
//     const chatBoxTopHeight = chatBoxTopRef.current?.clientHeight;
//     const goDownButton = goDownButtonRef.current;
//     const viewportHeight = window.innerHeight; // for userside

//     if (goDownButton) {
//       const viewportHeight = window.innerHeight;
//       if (chatBoxTopHeight && chatBoxTopHeight > viewportHeight / 1.5) {
//         goDownButton.style.display = 'block';
//       } else {
//         goDownButton.style.display = 'none';
//       }
//     }
//  };

//  useEffect(() => {
//     showGoDownButton();
//     window.addEventListener('resize', showGoDownButton);

//     return () => {
//       window.removeEventListener('resize', showGoDownButton);
//     };
//  }, []);

//  const handleSubmit = (e:React.FormEvent) => {
//   e.preventDefault();
//   const messageData = {
//     sender: location.pathname ==='/admin/dashboard/chat-screen' ? currentAdmin._id : currentUser._id,
//     text:newMessage,
//     conversationId:currentChat._id
//   }

//   const receiverId = currentChat.members.find((member:any) => member !== messageData.sender)
//   console.log('receiverId',receiverId);
//   console.log('senderId',messageData.sender);
//   console.log('text',messageData.text);
  
//   socket.current?.emit('sendMessage',{
//     senderId:messageData.sender,
//     receiverId:receiverId,
//     text:messageData.text
//   })
//   const response = dispatch(addNewMessage(messageData))
//     const responseUnwrapped = response.unwrap();
//     responseUnwrapped.then((thenResponse) => {
//       console.log("thenResponseAddMessage", thenResponse.message);
//       setMessages([...messages,thenResponse.message])
//       setNewMessage('')
//     });
//  }



//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({behavior:'smooth'})
//     const goDownButton = goDownButtonRef.current;
//     if (goDownButton) goDownButton.style.display  = 'none'
    
//   },[messages])
  
 
//   return (
    
//     <div className='messenger'> 
//      {location.pathname === '/admin/dashboard/chat-screen' && 
//      <div className="chatMenu">
//       <div className="chatMenuWrapper">
//         <TextField variant='standard' placeholder='Search for users' sx={{pb:1}} className='chatMenuInput' />
//         {conversations.map((conversation:any) => (
//           <div key={conversation._id} onClick={() =>  setCurrentChat(conversation)}>
//             <Conversation conversation={conversation} currentUserId={userId}/>
//           </div>
//         ))}
//       </div>
//      </div>
//       }
//      <div className="chatBox">
//       <div className="chatBoxWrapper">
//         {
//           currentChat ?
//         <>
//         <div className="chatBoxTop" ref={chatBoxTopRef}>
//         {messages.length > 0 ? (
//             messages.map((message: any) => (
//               <div className="" key={message.id} ref={scrollRef}>
//                 <Message message={message} own={message.sender === userId} />
//               </div>
//             ))
//           ) : (
            
//             <div className="noMessagesContainer">
//               <img src={'https://cdni.iconscout.com/illustration/premium/thumb/empty-inbox-8580677-6763402.png'} alt="No messages" className="noMessagesImage" />
//               <div className="noMessagesText">No messages yet!, Start conversation</div>
//             </div>
//           )}
//         </div>
//         <div className="chatBoxBottom">
//           <textarea className='chatMessageInput' onChange={(e) => setNewMessage(e.target.value)} 
//           value={newMessage}
//           placeholder='Your message here' />
//           <button hidden={newMessage.trim().length<=0} className='chatSubmitButton' onClick={handleSubmit}><Send  sx={{fontSize:'20px'}}/></button>
//           <button className={location.pathname =='/admin/dashboard/chat-screen' ? 'goDownButton':'goDownButtonUser'} ref={goDownButtonRef}><KeyboardDoubleArrowDownOutlined sx={{fontSize:'20px'}}/></button>
//         </div>
//         </>
//         :location.pathname =='/admin/dashboard/chat-screen' ? <span className='noConversationText'>Open a conversation to start a chat.</span> 
//         :<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
//         <span className='noConversationText'>Opening chat...</span>
//         <img className='spinnerGif' src={LoadingGif} alt='Loading' />
//       </div>}
//       </div>
//      </div>
//      {/* {location.pathname === '/admin/dashboard/chat-screen' &&
//      <div className="chatOnline">
//       <div className="chatOnlineWrapper">
//         <ChatOnline/>
//       </div>
//      </div>} */}
//     </div>
//   );
// };

// export default ChatScreen;