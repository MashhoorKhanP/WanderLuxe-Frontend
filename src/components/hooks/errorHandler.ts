import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface ErrorResponse {
  message: string;
  // Add other properties based on the structure of your JSON response
}

const errorHandle = (error: Error | AxiosError | {}) => {
  const axiosError = error as AxiosError;

  if (axiosError) {
    const errorResponse = axiosError as ErrorResponse;

    if (errorResponse.message === "Invalid email or password!") {
      // location.href = '/';
      toast.error(errorResponse.message);
    } else if (errorResponse.message === "You have been blocked by admin!") {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("UserToken");

      toast.error(errorResponse.message);
    } else if (
      errorResponse.message ===
      "Cannot read properties of undefined (reading 'success')"
    ) {
      toast.error("Something went wrong, please try again!");
    } else {
      toast.error(errorResponse.message);
    }
  } else {
    console.error("An error occurred. Please try again!");
    console.log(axiosError);
  }
};

export default errorHandle;
