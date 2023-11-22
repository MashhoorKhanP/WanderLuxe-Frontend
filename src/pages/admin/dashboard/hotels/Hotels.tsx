import React, { useEffect } from 'react';

interface HotelsProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Hotels: React.FC<HotelsProps> = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  return (
    <div>Hotels</div>
  );
};

export default Hotels;
