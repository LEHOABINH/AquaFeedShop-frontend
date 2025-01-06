import React, { useState } from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import config from '../../../../../config';
import { useHistory } from "react-router-dom";
import { showToast } from "../../Utils/Toast";
import RejectTopicModal from "./RejectTopicModal";
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'components';

const ApproveTopicDetailsContent = ({ data, onGroupSaved , onTopicRejected}) => {
  const history = useHistory(); // Sử dụng useHistory để điều hướng
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRegTopicId, setCurrentRegTopicId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const openConfirmationDialog = (groupId, topicCode, topicName, description) => {
    setSelectedTopic({ groupId, topicCode, topicName, description });
    toggleDialog();
};


  // Hàm xử lý approve topic
  const handleApprove = async () => {
    const { groupId, topicCode, topicName, description } = selectedTopic;

    try {
      const requestData = {
        groupId,
        topicCode,
        topicName,
        description,
        status: true,
      };

      const response = await axios.post(`${config.apiBaseUrl}api/reqTopic/ApproveTopic`, requestData, { withCredentials: true });

      if (response.status === 200) {
        showToast("success", "Topic approved successfully!");
        onGroupSaved(); // Reload danh sách sau khi approve
        history.push("/Views/Topic/ApproveTopic");
      } else {
        showToast("error", "Failed to approve topic.");
      }
    } catch (error) {
      showToast("error", `Error: ${error.response?.data || "Something went wrong!"}`);
    }
};


  // Hàm xử lý reject topic
  const handleDelete = async () => {
    try {
      const response = await axios.put(
        `${config.apiBaseUrl}api/reqTopic/RejectReqTopic/${currentRegTopicId}`,
        null,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        showToast("success", "Topic rejected successfully!");
        onGroupSaved(); // Reload danh sách sau khi reject
      } else {
        showToast("error", "Failed to reject topic.");
      }
    } catch (error) {
      showToast("error", `Error: ${error.response?.data || "Something went wrong!"}`);
    } finally {
      toggleDialog(); // Đóng dialog sau khi hoàn thành
    }
  };

  // Hàm tải file
  const handleDownload = async (regTopicId) => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}api/reqTopic/download?regTopicId=${regTopicId}`,
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
        <tr key={item.regTopicId}>
          <td>{item.topicName}</td>
          <td
            style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
            onClick={() => handleDownload(item.regTopicId)}
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
                <DropdownItem
                  onClick={() => openConfirmationDialog(item.groupId, item.topicCode, item.topicName, item.description)}
                >
                  <i className="fa fa-fw fa-check-circle mr-2 text-success"></i>
                  Approve
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setSelectedTopic(item);
                    toggleModal();
                  }}
                >
                  <i className="fa fa-fw fa-times-circle mr-2 text-danger"></i>
                  Reject
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </td>
        </tr>
      ))}
      <RejectTopicModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        selectedTopic={selectedTopic}
        onRejectSuccess={onTopicRejected}
      />
      {/* Modal xác nhận đăng ký */}
      <Modal isOpen={isDialogOpen} toggle={toggleDialog}>
        <ModalHeader toggle={toggleDialog}>Confirm registration</ModalHeader>
        <ModalBody>
          Are you sure you want to approve the topic: <b>{selectedTopic?.topicName}</b>?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDialog}>Cancel</Button>
          <Button color="primary" onClick={handleApprove}>Approve</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

ApproveTopicDetailsContent.propTypes = {
  data: PropTypes.array.isRequired,
  onGroupSaved: PropTypes.func.isRequired,
};

export { ApproveTopicDetailsContent };
