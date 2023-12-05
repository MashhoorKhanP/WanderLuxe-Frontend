import React, { useEffect } from "react";

interface BannersProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Banners: React.FC<BannersProps> = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  return <div>Banners</div>;
};

export default Banners;
