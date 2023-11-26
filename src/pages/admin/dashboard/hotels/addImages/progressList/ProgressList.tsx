import React from 'react';
import { ImageList } from '@mui/material';
import ProgressItem from './ProgressItem';

interface ProgressListProps {
  files: File[];
}

const ProgressList: React.FC<ProgressListProps> = ({ files }) => {
  return (
    <ImageList rowHeight={250}
    sx={{
      '&.MultiImageList-root':{
        gridTemplateColumns:'repeat(auto-fill , minmax(250px , 1fr)) !important'
      }
    }}
    >
      {files.map((file, index) => (
        <ProgressItem file={file} key={index} />
      ))}
    </ImageList>
  );
};

export default ProgressList;
