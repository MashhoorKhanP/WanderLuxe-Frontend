import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface ErrorResponse {
  message: string;
  // Add other properties based on the structure of your JSON response
}

const errorHandle = (error: Error | AxiosError | {}) => {
  const axiosError = error as AxiosError;
  console.log("Entered inside errorHandle function");

  if (axiosError) {
    const errorResponse = axiosError as ErrorResponse;
    console.log("Error message from server:", errorResponse.message);

    if (errorResponse.message === "Invalid email or password!") {
      console.log("Entered inside the toast.error");
      // location.href = '/';
      toast.error(errorResponse.message);
    } else if (errorResponse.message === "You have been blocked by admin!") {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("UserToken");
      
      toast.error(errorResponse.message);
    } else if (
      errorResponse.message === "Cannot read properties of undefined (reading 'success')"
    ) {
      toast.error("Something went wrong, please try again!");
    } else {
      toast.error(errorResponse.message);
    }
  } else {
    toast.error("An error occurred. Please try again!");
    console.log(axiosError);
  }
};

export default errorHandle;
