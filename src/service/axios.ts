/// <reference types="axios" />

import axios from "axios";

const Api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
  withCredentials: true,
});

export default Api;
