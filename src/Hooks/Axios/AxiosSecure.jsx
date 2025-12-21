import axios from "axios";
import { getAuth } from "firebase/auth";

const AxiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

AxiosSecure.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
});

export default AxiosSecure;
