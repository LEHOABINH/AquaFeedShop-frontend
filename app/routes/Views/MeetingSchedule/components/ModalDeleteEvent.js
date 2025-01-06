// ConfirmDeleteModal.js
import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "../../../../components";

const ConfirmDeleteModal = ({ isOpen, toggle, onDelete, itemName }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="sm">
      <ModalHeader tag="h6">
        <i className="fa fa-trash mr-2"></i> Delete {itemName}
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete this {itemName}? This action cannot be undone.
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onDelete}>
          <i className="fa fa-check mr-2"></i> Sure
        </Button>
        <Button color="secondary" onClick={toggle}>
          <i className="fa fa-close mr-2"></i> No
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmDeleteModal;
