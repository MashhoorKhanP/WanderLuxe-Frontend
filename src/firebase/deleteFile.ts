import { deleteObject, ref, StorageReference } from "firebase/storage";
import { storage } from "./config";

const deleteFile = (filePath: string): Promise<void> => {
  const imageRef: StorageReference = ref(storage, filePath);
  return deleteObject(imageRef);
};

export default deleteFile;
