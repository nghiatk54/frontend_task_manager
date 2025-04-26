import { API_PATHS } from "@/utils/apiPath";
import axiosInstance from "@/utils/axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  // append image file to form data
  formData.append("image", imageFile);
  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // set headers for file upload
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading image", error);
    throw error; // rethrow error to be handled by the caller
  }
};

export default uploadImage;
