import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Button } from 'reactstrap'; // Import Button từ reactstrap hoặc từ component của bạn
import { useHistory } from 'react-router-dom';

const ApproveTopicContent = ({ data }) => {
  const history = useHistory(); // Khởi tạo useHistory
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteRegTopicId, setDeleteRegTopicId] = useState(null);
  const [description, setDescription] = useState('');
  const [topicName, setTopicName] = useState('');
  const [regTopicId, setRegTopicId] = useState(''); // Thêm state để lưu regTopicId

  const toggleModal = () => setIsModalOpen(!isModalOpen); // Hàm đóng/mở modal chỉnh sửa
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  const handleDetail = (groupId) => {
    history.push({
      pathname: '/views/topic/approveTopicDetails',
      state: { groupId }, // Truyền groupId vào state
    });
  };

  return (
    <React.Fragment>
      {data.map((item) => (
        <tr key={item.groupId}>
          <td>{item.groupName}</td>
          <td>{item.subjectCode}</td>
          <td className="text-right">
            <Button
              color="primary" // Màu của nút
              outline // Nút có viền
              className="align-self-center" // Căn chỉnh nút
              onClick={() => handleDetail(item.groupId)} // Xử lý khi click
            >
              View Topic
            </Button>
          </td>
        </tr>
      ))}
    </React.Fragment>
  );
};

ApproveTopicContent.propTypes = {
  data: PropTypes.array.isRequired,
};

export { ApproveTopicContent };
