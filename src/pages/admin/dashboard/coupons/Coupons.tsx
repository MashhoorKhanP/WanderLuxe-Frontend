import React, { useEffect } from 'react';

interface CouponsProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Coupons: React.FC<CouponsProps> = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  return (
    <div>Coupons</div>
  );
};

export default Coupons;
