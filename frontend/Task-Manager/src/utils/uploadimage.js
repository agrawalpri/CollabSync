import axiosInstance from "./axiosinstance";
import { API_PATHS } from "./apiPaths";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("Upload image response:", response.data);

    // Normalize output to always return { imageUrl }
    if (response.data?.imageUrl) {
      return { imageUrl: response.data.imageUrl };
    } else if (response.data?.url) {
      return { imageUrl: response.data.url };
    } else if (response.data?.data?.url) {
      return { imageUrl: response.data.data.url };
    } else {
      throw new Error("Image URL not found in response");
    }
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

export default uploadImage;
