import axios from "axios";
import config from "./../../../../config";
import { showToast } from "./../../Views/Utils/Toast";

export const handleLogout = async (history) => {
  try {
    const response = await axios.post(`${config.apiBaseUrl}api/auth/logout`, {}, { withCredentials: true });

    if (response.data.success) {
      showToast("success", response.data.data);
      sessionStorage.removeItem("AccessToken");
    }
  } catch (error) {
    console.error("Logout error", error);
  } finally{
    history.push('/auth/signin');
  }
};