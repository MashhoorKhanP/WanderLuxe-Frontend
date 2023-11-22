import React, { useEffect } from 'react';

interface OffersProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Offers: React.FC<OffersProps> = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  return (
    <div>Offers</div>
  );
};

export default Offers;
