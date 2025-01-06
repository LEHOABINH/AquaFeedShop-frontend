import React, { useState } from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import config from '../../../../../config';
import { showToast } from "../../Utils/Toast";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Media,
  Avatar,
  AvatarAddOn,
} from 'components';

const ViewTopicMentorContent = ({ data, onGroupSaved, userRole }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  const openConfirmationDialog = (topic) => {
    setSelectedTopic(topic);
    toggleDialog();
  };

  const handleRegister = async () => {
    if (!selectedTopic) return;

    const { topicCode, topicName, description } = selectedTopic;

    try {
      const requestData = {
        topicCode,
        topicName,
        description,
        isRegistered: true,
      };

      const response = await axios.post(
        `${config.apiBaseUrl}api/topicMentor/RegisteredTopic`,
        requestData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        showToast("success", "Topic registered successfully!");
        onGroupSaved(); 
        toggleDialog();
      } else {
        showToast("error", "Failed to register topic.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errorMessage || "Failed to register group.";
      showToast("error", errorMessage); 
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
          <td className="align-middle">
            <Media>
              <Avatar.Image
                size="md"
                src={item.mentor?.user?.avatar}
              />
              <Media body className="ml-2 align-self-center">
                {item.mentor?.user?.fullName}
              </Media>
            </Media>
          </td>
          <td className="text-center">
            {item.isRegistered ? (
              <span style={{ color: "green", fontSize: "1.2em" }}>✔️</span>
            ) : (
              <span style={{ color: "red", fontSize: "1.2em" }}>❌</span>
            )}
          </td>
          <td className="text-right">
            {userRole === "Leader" && !item.isRegistered && (
              <Button
                color="primary"
                outline
                className="align-self-center"
                onClick={() => openConfirmationDialog(item)}
              >
                Register
              </Button>
            )}
          </td>
        </tr>
      ))}
      <Modal isOpen={isDialogOpen} toggle={toggleDialog}>
        <ModalHeader toggle={toggleDialog}>Confirm registration</ModalHeader>
        <ModalBody>
          Are you sure you want to register the topic: <b>{selectedTopic?.topicName}</b>?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDialog}>Cancel</Button>
          <Button color="primary" onClick={handleRegister}>Register</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

ViewTopicMentorContent.propTypes = {
  data: PropTypes.array.isRequired,
  onGroupSaved: PropTypes.func.isRequired,
  userRole: PropTypes.string, 
};

export { ViewTopicMentorContent };
