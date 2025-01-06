import React, { useState } from 'react';
import PropTypes from "prop-types";
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "../../../../components";
import axios from "axios";
import config from '../../../../../config';
import { showToast } from "../../Utils/Toast";
import MyTopicFormModal from "./MyTopicFormModal"; 

const MyTopicContent = ({ data, onGroupSaved , userRole}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteRegTopicId, setDeleteRegTopicId] = useState(null);
  const [description, setDescription] = useState('');
  const [topicName, setTopicName] = useState('');
  const [regTopicId, setRegTopicId] = useState(''); 

  const toggleModal = () => setIsModalOpen(!isModalOpen); 
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  const handleEdit = (description, regTopicId, topicName) => {
    setDescription(description);
    setTopicName(topicName);
    setRegTopicId(regTopicId);
    toggleModal(); // Mở modal
  };

  const handleDeleteClick = (regTopicId) => {
    setDeleteRegTopicId(regTopicId);
    toggleDialog();
  };

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

  const handleDelete = async () => {
    try {
      const response = await axios.put(
        `${config.apiBaseUrl}api/reqTopic/DeleteReq`,
        deleteRegTopicId,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.success) {
        onGroupSaved();
        showToast("success", `Deleted topic successfully!`);
      }
      toggleDialog(); 
    } catch (error) {
      const errorMessage = error.response?.data?.errorMessage || "Failed to delete topic.";
      showToast("error", errorMessage);
      console.error("Error deleting topic:", error);
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
          <td>{item.subjectCode}</td>
          <td className="text-right">
          {userRole === "Leader" && (
            <UncontrolledButtonDropdown>
              <DropdownToggle color="link" className="text-decoration-none">
                <i className="fa fa-gear"></i>
                <i className="fa fa-angle-down ml-2"></i>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => handleEdit(item.description, item.regTopicId, item.topicName)}>
                  <i className="fa fa-fw fa-edit mr-2"></i>Edit
                </DropdownItem>
                <DropdownItem onClick={() => handleDeleteClick(item.regTopicId)}>
                  <i className="fa fa-fw fa-trash mr-2"></i>Delete
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
           )}
          </td>
          
        </tr>
      ))}

     
      <MyTopicFormModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        onGroupSaved={onGroupSaved}
        description={description}
        topicName={topicName}
        regTopicId={regTopicId}
      />

     
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

MyTopicContent.propTypes = {
  data: PropTypes.array.isRequired,
  onGroupSaved: PropTypes.func.isRequired,
};

export { MyTopicContent };
