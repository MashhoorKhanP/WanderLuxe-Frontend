import { CheckCircleOutline } from '@mui/icons-material';
import { Box, ImageListItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { v4 as uuidv4 } from 'uuid';
import uploadFileProgress from '../../../../../../firebase/uploadFileProgress';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/types';
import { updateAddedHotelImages, updateHotelImages } from '../../../../../../store/slices/adminSlice';
import { toast } from 'react-toastify';


interface ProgressItemProps {
  file: File;
}

const ProgressItem: React.FC<ProgressItemProps> = ({ file }) => {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const { currentAdmin } = useSelector((state: RootState) => state.admin);
  const udpatedHotel:any = useSelector((state: RootState) => state.admin.updatedHotel);

  useEffect(() => {
    const uploadImage = async () => {
      const imageName = uuidv4() + '.' + file.name.split('.').pop();
      try {
        const url:string = await uploadFileProgress(
          file,
          `hotels/${currentAdmin?._id}`,
          imageName,
          setProgress
        );
        
        dispatch(updateHotelImages([url]))
        // if(udpatedHotel) dispatch(updateAddedHotelImages([url]))
        setImageURL(null);
      } catch (error) {
        const typedError = error as Error;
        toast.error(typedError.message)
        console.log(typedError);
      }
    };

    setImageURL(URL.createObjectURL(file));
    uploadImage();
  }, [file]);

  return (
    imageURL && (
      <ImageListItem cols={1} rows={1}>
        <img src={imageURL} alt="gallery" loading="lazy" />
        <Box sx={backDrop}>
          {progress < 100 ? (
            <CircularProgressWithLabel value={progress} />
          ) : (
            <CheckCircleOutline
              sx={{ width: 60, height: 60, color: 'lightgreen' }}
            />
          )}
        </Box>
      </ImageListItem>
    )
  );
};

export default ProgressItem;

const backDrop = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0, .5)',
};
