import React, { useEffect } from 'react';

interface BookingsProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Bookings: React.FC<BookingsProps> = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  return (
    <div>Bookings</div>
  );
};

export default Bookings;
