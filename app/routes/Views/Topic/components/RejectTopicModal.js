import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from "../../../../components";
import { showToast } from "../../Utils/Toast";
import axios from "axios";
import config from "./../../../../../config";

const RejectTopicModal = ({ isOpen, toggle, selectedTopic, onRejectSuccess  }) => {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = async () => {
    if (selectedTopic) {
      try {
        const requestData = {
          RegTopicId: selectedTopic.regTopicId,
          RejectionReason: rejectionReason.trim(),
        };
  
        console.log('Request Data:', requestData); // Kiểm tra dữ liệu gửi đi
  
        const response = await axios.post(
          `${config.apiBaseUrl}api/reqTopic/RejectTopic`,
          requestData,
          { withCredentials: true }
        );
  
        console.log('Response:', response); // Kiểm tra phản hồi từ API
  
        if (response.data.success) {
          showToast("success", response.data.data);
          if (onRejectSuccess) onRejectSuccess();
        } else {
          showToast("error", response.data.errorMessage);
        }
      } catch (error) {
        console.error('API Error:', error); // Log lỗi để kiểm tra nguyên nhân
        showToast("error", `Error: ${error.response?.data || "Something went wrong!"}`);
      }
    }
    setRejectionReason("");
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Reject Topic</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="rejectionReason">Reason for Rejecting</Label>
          <Input
            type="textarea"
            id="rejectionReason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)} // Cập nhật lý do từ chối
            placeholder="Optional: Provide a reason for rejecting"
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
        <Button color="danger" onClick={handleReject}>Reject</Button>
      </ModalFooter>
    </Modal>
  );
};

export default RejectTopicModal;