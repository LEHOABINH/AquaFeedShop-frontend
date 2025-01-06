import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie'; // Import thư viện cookie
import { Avatar, AvatarAddOn } from "../../../../components";
import config from './../../../../../config'; // Đảm bảo rằng bạn có file cấu hình với đường dẫn API

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // Hàm gọi API để lấy thông tin user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}api/user/ProfileUser`, {
          withCredentials: true,
        });
        setUserData(response.data); // Lưu dữ liệu user vào state
      } catch (err) {
        setError('Lỗi khi lấy thông tin người dùng');
        console.error('Error fetching user profile:', err);
      }
    };

    fetchProfile(); // Gọi hàm để lấy dữ liệu khi component mount
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>; // Hiển thị trong khi chờ dữ liệu
  }

  // const role = userData.role?.name;
  // alert(role);
  const major = userData.students?.[0]?.major;

  return (
    <React.Fragment>
      <div className="d-flex justify-content-center my-3">
        <Avatar.Image
          size="lg"
          src={userData.avatar || "https://res.cloudinary.com/dan0stbfi/image/upload/v1722340236/xhy3r9wmc4zavds4nq0d.jpg"} // Hiển thị avatar nếu có
          addOns={[
            <AvatarAddOn.Icon
              className="fa fa-circle"
              color="white"
              key="avatar-icon-bg"
            />,
            <AvatarAddOn.Icon
              className="fa fa-circle"
              color="success"
              key="avatar-icon-fg"
            />,
          ]}
        />
      </div>
      <div className="mb-4 text-center">
        <a className="h6 text-decoration-none" href="#">
          {userData.fullName || "User Name"}  {/* Hiển thị tên người dùng */}
        </a>
        <div className="text-center mt-2">{major}</div> {/* Hiển thị ngành học (major) */}
        <div className="text-center">
          <i className="fa fa-map-marker mr-1"></i>
          {userData.campus?.campusName || "Location"}  {/* Hiển thị địa điểm */}
        </div>
      </div>
    </React.Fragment>
  );
};

export { Profile };
