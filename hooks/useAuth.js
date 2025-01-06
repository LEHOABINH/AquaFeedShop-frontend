import { jwtDecode } from "jwt-decode";
const useAuth = () => {
  const token = sessionStorage.getItem("AccessToken");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const id =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      const username =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const email =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ];
      const avatar =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri"
        ];
      const permissions = decoded.permissions || [];
      const hasPermission = (permission) => {
        return permissions.includes(permission); // Kiểm tra nếu permissions có chứa quyền cần kiểm tra
      };
      return { id, username, role, email, avatar, permissions, hasPermission};
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }
  return {
    id: "",
    username: "",
    role: "",
    email: "",
    avatar: "",
    permissions: [],
    hasPermission: () => false
  };
};

export default useAuth;
