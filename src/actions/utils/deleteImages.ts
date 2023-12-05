import deleteFile from "../../firebase/deleteFile";

const deleteImages = async (images: any, adminId: string) => {
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
};

export default deleteImages;
