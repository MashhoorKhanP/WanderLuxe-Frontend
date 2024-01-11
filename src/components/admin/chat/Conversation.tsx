import React, { useEffect, useState } from "react";
import "./conversation.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/types";

interface ConversationProps {
  conversation: [] | any;
  currentUserId: string;
}

const Conversation: React.FC<ConversationProps> = ({
  conversation,
  currentUserId,
}) => {
  const allUsers = useSelector((state: RootState) => state.admin.users);
  const [users, setUsers] = useState<any>(null);

  useEffect(() => {
    const userId = conversation.members.find(
      (member: any) => member !== currentUserId
    );
    const usersData = allUsers.find((user: any) => user._id === userId);

    setUsers(usersData);
  }, [currentUserId, conversation]);

  return (
    <div className="conversation">
      {users?.profileImage ? (
        <img
          className="conversationImg"
          src={users?.profileImage}
          alt="Profile"
        />
      ) : (
        <div className="conversationImgNoImage">
          {users?.firstName.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="conversationName">{`${users?.firstName} ${users?.lastName}`}</span>
    </div>
  );
};

export default Conversation;
