import React, { useEffect } from 'react';

interface RoomsProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Rooms: React.FC<RoomsProps> = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  return (
    <div>Rooms</div>
  );
};

export default Rooms;
