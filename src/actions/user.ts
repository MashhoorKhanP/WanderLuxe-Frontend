import { useDispatch } from "react-redux";
import {
  setAlert,
  setCloseLogin,
  startLoading,
  stopLoading,
  updateUser,
} from "../store/slices/userSlice";
import fetchData from "./utils/fetchData";

interface RequestBody {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password?: string;
  // ... other properties
}

interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password?: string;
  profileImage?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  wallet?: number | null;
  wishlist?: {}[];
  isGoogle?: boolean;
}
export const register = async (user: User) => {
  // const dispatch = useDispatch();
  const url: string = import.meta.env.VITE_SERVER_URL + "/api/user";

  // dispatch(startLoading());

  //send request with axios
  try {
    const requestBody: RequestBody = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      password: user.password,
      // Map other properties as needed
    };

    const result = await fetchData({
      url: url + "/signup",
      method: "POST",
      body: requestBody,
    });
    if (result) {
    //   dispatch(updateUser(result));
    //   dispatch(setCloseLogin());
    //   dispatch(
    //     setAlert({
    //       open: true,
    //       severity: "success",
    //       message: "Verification OTP has been sent to your email address!",
    //     })
    //   );
    // }
    // dispatch(stopLoading());
} 
}catch (error) {
    // Handle error, e.g., dispatch an action to show an error alert
    console.error("Registration failed:", error);
    // dispatch(
    //   setAlert({
    //     open: true,
    //     severity: "error",
    //     message: "Registration failed. Please try again.",
    //   })
    // );
    // dispatch(stopLoading());
  }
};
