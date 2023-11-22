import React, { useEffect } from 'react';

interface UsersProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Users: React.FC<UsersProps> = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  return (
    <div>Users</div>
  );
};

export default Users;
