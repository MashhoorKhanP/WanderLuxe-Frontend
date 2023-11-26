import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from './config';

const uploadFileProgress = (file: File, subFolder: string, imageName: string, setProgress: (progress: number) => void): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, subFolder + '/' + imageName);
    const upload = uploadBytesResumable(storageRef, file);
    upload.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(storageRef);
          resolve(url);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

export default uploadFileProgress;