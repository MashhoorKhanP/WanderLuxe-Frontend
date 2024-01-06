import { useLocation } from "react-router-dom";
import deleteFile from "../../firebase/deleteFile";

const deleteImages = async (images: any, adminId: string) => {
  const location = useLocation();
  if(location.pathname === 'location.pathname === "/admin/dashboard/hotels'){

    if (images.length > 0) {
      const promises = images.map((imgURL: string) => {
        const imageName = imgURL?.split(`${adminId}%2F`)[1]?.split("?")[0];
        return deleteFile(`hotels/${adminId}/${imageName}`);
      });
      try {
        await Promise.all(promises);
      } catch (error) {
        console.log(error);
      }
    }
  }else if(location.pathname === "/admin/dashboard/rooms"){
    if (images.length > 0) {
      const promises = images.map((imgURL: string) => {
        const imageName = imgURL?.split(`${adminId}%2F`)[1]?.split("?")[0];
        return deleteFile(`rooms/${adminId}/${imageName}`);
      });
      try {
        await Promise.all(promises);
      } catch (error) {
        console.log(error);
      }
    }
  }else if(location.pathname === "/admin/dashboard/banners"){
    if (images.length > 0) {
      const promises = images.map((imgURL: string) => {
        const imageName = imgURL?.split(`${adminId}%2F`)[1]?.split("?")[0];
        return deleteFile(`banners/${adminId}/${imageName}`);
      });
      try {
        await Promise.all(promises);
      } catch (error) {
        console.log(error);
      }
    }
  }  
};

export default deleteImages;
