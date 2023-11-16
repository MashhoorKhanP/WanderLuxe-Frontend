import { useDispatch } from "react-redux";
import { logoutUser, setAlert } from '../../store/slices/userSlice'
import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface RequestBody {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password?: string;
  // ... other properties
}

interface FetchDataOptions {
  url: string;
  method: string;
  token?: string;
  body?: RequestBody | null;
}

const fetchData = async ({
  url,
  method,
  token = "",
  body = null,
}: FetchDataOptions) => {
  // const dispatch = useDispatch();
  const headers = token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
  // body = body ? {body:JSON.stringify(body)} : {}
  const axiosConfig: AxiosRequestConfig = {
    method,
    url,
    headers,
    data: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await axios(axiosConfig);
    const data = await response.data;
    if (!data.success) {
      // if (response.status === 401) dispatch(logoutUser());
      throw new Error(data.message);
    }
    return data.result;
  } catch (error) {
    const typedError = error as AxiosError;
    // dispatch(
    //   setAlert({ open: true, severity: "error", message: typedError.message })
    // );
    console.log(typedError.message);
    return null;
  }
};

export default fetchData;
