// ConfirmDeleteModal.js
import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "../../../../components";
import axios from "axios";
import config from "../../../../../config";
import { showToast } from "../../Utils/Toast";

const ModelDeleteMessage = ({ isOpen, toggle, messageId}) => {
    const handleDeleteMessage = async () => {
        try {
          const response = await axios.delete(
            `${config.apiBaseUrl}api/chat-groups/${messageId}`,
            { withCredentials: true }
          );
    
          if (response.data.success) {
            showToast("success", response.data.data);
          } else {
            showToast("error", response.data.errorMessage);
          }
          toggle();
        } catch (error) {
          console.error("Error deleting event:", error);
          showToast("error", "Failed to delete event!");
        }
    };
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="sm">
      <ModalHeader tag="h6">
        <i className="fa fa-trash mr-2"></i> Delete Message
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete this message? This action cannot be undone.
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleDeleteMessage}>
          <i className="fa fa-check mr-2"></i> Sure
        </Button>
        <Button color="secondary" onClick={toggle}>
          <i className="fa fa-close mr-2"></i> No
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModelDeleteMessage;