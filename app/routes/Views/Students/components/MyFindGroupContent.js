import React, { useState } from 'react';
import PropTypes from "prop-types";
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Media,
  Avatar,
  AvatarAddOn,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../../../components";
import FindGroupFormModal from './FindGroupFormModal'; // Import modal
import config from '../../../../../config';
import axios from "axios"; // Import axios để gọi API
import { showToast } from "./../../Utils/Toast"; // Nhập showToast

const MyFindGroupContent = ({ data, role, onGroupSaved }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [description, setDescription] = useState('');
  const [regMemberId, setRegMemberId] = useState(null); 
  const [deleteRegMemberId, setDeleteRegMemberId] = useState(null); // ID của yêu cầu cần xóa

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen); 

  const handleEdit = (description, regMemberId) => {
    setDescription(description); 
    setRegMemberId(regMemberId); 
    toggleModal(); 
  };

  const handleDeleteClick = (regMemberId) => {
    setDeleteRegMemberId(regMemberId); 
    toggleDialog(); 
  };

  const handleDelete = async () => {
    try {
      const response = await axios.put(`${config.apiBaseUrl}api/reqMembers/DeleteReq`, deleteRegMemberId, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        onGroupSaved();
        showToast("success", response.data.data.message || "Request deleted successfully!");
      }
      toggleDialog(); 
    } catch (error) {
      const errorMessage = error.response?.data?.errorMessage || "Failed to save request.";
      showToast("error", errorMessage); 
      console.error('Error updating member request:', errorMessage);
    }
  };

  return (
    <React.Fragment>
      {data.map((item, index) => (
        <tr key={index}>
          <td>{item.groupName}</td>
          <td>{item.description}</td>
          <td>{item.subjectCode}</td>
          <td>{item.memberCount}</td>
          <td>
            <Media>
              <Avatar.Image
                size="md"
                src={item.leaderAvatar}
              />
              <Media body className="ml-2 align-self-center">
                {item.leaderName}
              </Media>
            </Media>
          </td>
          {role === "Leader" && ( 
            <td className="align-middle text-right">
              <UncontrolledButtonDropdown>
                <DropdownToggle color="link" className="text-decoration-none">
                  <i className="fa fa-gear"></i>
                  <i className="fa fa-angle-down ml-2"></i>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => handleEdit(item.description, item.regMemberId)}>
                    <i className="fa fa-fw fa-edit mr-2"></i>Edit
                  </DropdownItem>
                  <DropdownItem onClick={() => handleDeleteClick(item.regMemberId)}>
                    <i className="fa fa-fw fa-trash mr-2"></i>Delete
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </td>
          )}
        </tr>
      ))}
      <FindGroupFormModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        onGroupSaved={onGroupSaved}
        description={description}
        groupName={data[0]?.groupName}
        regMemberId={regMemberId}
      />
      <Modal isOpen={isDialogOpen} toggle={toggleDialog}>
        <ModalHeader toggle={toggleDialog}>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this request?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDialog}>Cancel</Button>
          <Button color="danger" onClick={handleDelete}>Delete</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

MyFindGroupContent.propTypes = {
  data: PropTypes.array.isRequired,
  role: PropTypes.string.isRequired, 
  onGroupSaved: PropTypes.func.isRequired,
};

export { MyFindGroupContent };
