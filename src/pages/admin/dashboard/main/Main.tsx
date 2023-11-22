import React, { useEffect } from 'react';

interface MainProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Main: React.FC<MainProps> = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  return (
    <div>Admin Home</div>
  );
};

export default Main;
