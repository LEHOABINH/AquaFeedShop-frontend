import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import config from '../../../../../config';
import axios from "axios";

const GroupDetailsContent = ({ groupId, setMentorName }) => { // Nhận groupId và setMentorName như một prop
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}api/groupMember/GetUsersByGroupId/${groupId}`);
        console.log("Phản hồi từ API:", response.data); // Kiểm tra phản hồi
        if (response.data) {
          setData(response.data);
          console.log("Dữ liệu đã được lưu:", response.data); // Kiểm tra dữ liệu đã được lưu
          if (response.data.length > 0) {
            setMentorName(response.data[0].mentorName); // Cập nhật mentorName từ phần tử đầu tiên
          }
        }
      } catch (error) {
        console.error("Không lấy được dữ liệu!", error);
      }
    };

    if (groupId) {
      fetchData();
    }
  }, [groupId, setMentorName]); // Thêm setMentorName vào dependency để đảm bảo cập nhật đúng

  return (
    <React.Fragment>
      {data.map((item, index) => (
        <tr key={index}>
          <td className="align-middle">{item.fullName}</td>
          <td className="align-middle">{item.email}</td>
          <td className="align-middle">{item.major}</td>
          <td className="align-middle">{item.studentCode}</td>
          <td className="align-middle">{item.role}</td>
        </tr>
      ))}
    </React.Fragment>
  );
};

GroupDetailsContent.propTypes = {
  groupId: PropTypes.number.isRequired,
  setMentorName: PropTypes.func.isRequired, // Thêm prop types để nhận hàm setMentorName
};

export { GroupDetailsContent };
