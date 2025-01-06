import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../../../config';
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
} from 'components';
import { showToast } from "./../../Utils/Toast";
import ContactModal from './ContactModal';

const MyGroupContent = ({ onGroupDataChange , userRole}) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalContactOpen, setModalContactOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const toggleModalContact = (leaderId) => {
    setSelectedUserId(leaderId);
    setModalContactOpen(!modalContactOpen);
  };

  useEffect(() => {
    fetchData();
  }, [onGroupDataChange]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}api/groupMember/MyGroup`, {
        withCredentials: true,
      });
      setData(response.data.data);
      if (response.data.data.length > 0) {
        const groupId = response.data.data[0].groupId;
        const groupName = response.data.data[0].groupName;
        const status = response.data.data[0].status;
        const subjectCode = response.data.data[0].subjectCode;
        const mentorName = response.data.data[0].mentorName || "Chưa có nhóm";
        onGroupDataChange(groupId, groupName, mentorName,status,subjectCode);
      }
    } catch (err) {
      setError('Students have not joined the group yet.');
      console.error("Error fetching group members:", err);
    }
  };

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  const confirmDelete = (groupId, studentId) => {
    setSelectedMember({ groupId, studentId });
    toggleDialog();
  };

  const handleDelete = async () => {
    if (!selectedMember) return;
    try {
      const response = await axios.delete(`${config.apiBaseUrl}api/groupMember/DeleteMember`, {
        data: { groupId: selectedMember.groupId, studentId: selectedMember.studentId },
        withCredentials: true,
      });
  
      if (response.data.success) {
        showToast("success", response.data.data.message || "Đã xoá thành viên khỏi nhóm!");
        fetchData();
      } else {
        showToast("error", response.data.errorMessage || "Lỗi không xác định.");
      }
    } catch (err) {
      console.error("Error deleting member:", err.response?.data || err.message);
      showToast("error", err.response?.data?.errorMessage || "Lỗi khi xoá thành viên.");
    } finally {
      toggleDialog();
    }
  };

  if (error) {
    return (
      <tr>
        <td colSpan="6">
          {error}
        </td>
      </tr>
    );
  }

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      {data.map((item, index) => (
        <tr key={index}>
          <td className="align-middle">{item.fullName}</td>
          <td className="align-middle">{item.email}</td>
          <td className="align-middle">{item.major || 'No major information yet'}</td>
          <td className="align-middle">{item.studentCode || 'No student code yet'}</td>
          <td className="align-middle">{item.role || 'No role yet'}</td>
          <td className="align-middle text-right">
          {userRole === "Leader" && (
            <UncontrolledButtonDropdown>
              <DropdownToggle color="link" className="text-decoration-none">
                <i className="fa fa-gear"></i>
                <i className="fa fa-angle-down ml-2"></i>
              </DropdownToggle>
              <DropdownMenu right>
                {/* <DropdownItem>
                  <i className="fa fa-fw fa-envelope mr-2"></i>
                  Detail
                </DropdownItem> */}
                <DropdownItem onClick={() => toggleModalContact(item.userId)}>
                  <i className="fa fa-fw fa-phone mr-2"></i>
                  Contact
                </DropdownItem>
                <DropdownItem onClick={() => confirmDelete(item.groupId, item.studentId)}>
                  <i className="fa fa-fw fa-trash mr-2"></i>
                  Kick
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
             )}
          </td>
        </tr>
      ))}

      <Modal isOpen={isDialogOpen} toggle={toggleDialog}>
        <ModalHeader toggle={toggleDialog}>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you want to remove this member?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDialog}>Cancel</Button>
          <Button color="danger" onClick={handleDelete}>Delete</Button>
        </ModalFooter>
      </Modal>
      <ContactModal isOpen={modalContactOpen} toggle={toggleModalContact} contactedUserId = {selectedUserId}/>
    </React.Fragment>
  );
};

export { MyGroupContent };
