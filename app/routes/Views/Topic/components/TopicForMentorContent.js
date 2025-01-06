import React, { useState } from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import config from '../../../../../config';
import { useHistory } from "react-router-dom";
import { showToast } from "../../Utils/Toast";
import TopicForMentorFormModal from "./TopicForMentorFormModal";
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'components';

const TopicForMentorContent = ({ data, onGroupSaved, onTopicRejected }) => {
  const history = useHistory(); // Sử dụng useHistory để điều hướng
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTopicForMentorId, setDeleteTopicForMentorId] = useState(null);
  const [description, setDescription] = useState('');
  const [topicName, setTopicName] = useState('');
  const [topicForMentorId, setTopicForMentorId] = useState(''); // Thêm state để lưu regTopicId
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleEdit = (description, topicForMentorId, topicName) => {
    setDescription(description);
    setTopicName(topicName);
    setTopicForMentorId(topicForMentorId);
    toggleModal(); // Mở modal
  };

  const handleDeleteClick = (topicForMentorId) => {
    setDeleteTopicForMentorId(topicForMentorId);
    toggleDialog();
  };

  const handleDelete = async () => {
    try {
      const response = await axios.put(
        `${config.apiBaseUrl}api/topicMentor/DeleteTopicMentor`,
        deleteTopicForMentorId,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.success) {
        onGroupSaved(); // Load lại danh sách sau khi xóa thành công
        showToast("success", `Deleted topic successfully!`);
      }
      toggleDialog(); // Đóng modal xác nhận
    } catch (error) {
      const errorMessage = error.response?.data?.errorMessage || "Failed to delete topic.";
      showToast("error", errorMessage);
      console.error("Error deleting topic:", error);
    }
  };

  const handleDownload = async (topicForMentorId) => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}api/topicMentor/download?topicForMentorId=${topicForMentorId}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.url) {
        const fileUrl = response.data.url;

        const anchor = document.createElement('a');
        anchor.href = fileUrl;
        anchor.target = '_self';

        if (navigator.msSaveOrOpenBlob) {
          const blobResponse = await axios.get(fileUrl, { responseType: 'blob' });
          const blob = new Blob([blobResponse.data]);
          navigator.msSaveOrOpenBlob(blob, 'download');
        } else {
          anchor.download = '';
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
        }

        showToast("success", "File is downloading!");
      } else {
        showToast("error", "Failed to get file URL.");
      }
    } catch (error) {
      showToast("error", `Error: ${error.response?.data?.errorMessage || "Something went wrong!"}`);
    }
  };

  return (
    <React.Fragment>
      {data.map((item) => (
        <tr key={item.topicForMentorId}>
          <td>{item.topicName}</td>
          <td
            style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
            onClick={() => handleDownload(item.topicForMentorId)}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
          >
            {item.description.split('/').pop()}
          </td>

          <td className="text-right">
            <UncontrolledButtonDropdown>
              <DropdownToggle color="link" className="text-decoration-none">
                <i className="fa fa-gear"></i>
                <i className="fa fa-angle-down ml-2"></i>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => handleEdit(item.description, item.topicForMentorId, item.topicName)}>
                  <i className="fa fa-fw fa-edit mr-2"></i>Edit
                </DropdownItem>
                <DropdownItem onClick={() => handleDeleteClick(item.topicForMentorId)}>
                  <i className="fa fa-fw fa-trash mr-2"></i>Delete
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </td>
        </tr>
      ))}
      {/* Hiển thị modal chỉnh sửa */}
      <TopicForMentorFormModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        onGroupSaved={onGroupSaved}
        description={description}
        topicName={topicName}
        topicForMentorId={topicForMentorId}
      />
      {/* Modal xác nhận xóa */}
      <Modal isOpen={isDialogOpen} toggle={toggleDialog}>
        <ModalHeader toggle={toggleDialog}>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this topic?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDialog}>Cancel</Button>
          <Button color="danger" onClick={handleDelete}>Delete</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

TopicForMentorContent.propTypes = {
  data: PropTypes.array.isRequired,
  onGroupSaved: PropTypes.func.isRequired,
};

export { TopicForMentorContent };
