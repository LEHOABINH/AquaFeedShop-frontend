import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "../../../../components";
import ModalGroupDetails from "./ModalGroupDetails"; 
import useAuth from "../../../../../hooks/useAuth";

const TrTableGroupsList = ({ group, fetchGroups, fetchStudentsWithoutGroup }) => {
  const { role } = useAuth();
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleDetails = () => {
    setSelectedGroup(group);
    setModalOpen(true); 
  };

  const toggleModal = () => setModalOpen(!isModalOpen);

  const handleDeleteMember = (studentId) => {
    console.log("Delete member with studentId:", studentId);

    setSelectedGroup(prevGroup => ({
      ...prevGroup,
      groupMembers: prevGroup.groupMembers.filter(member => member.studentId !== studentId),
    }));
  };

  return (
    <>
      <tr>
        <td className="align-middle">{group.groupName}</td>
        <td className="align-middle">{group.campusCode}</td>
        <td className="align-middle">{group.subjectCode}</td>
        <td className="align-middle">{group.status}</td>
        <td className="align-middle">{group.groupMembers.length}</td>
        <td className="align-middle">
          {group.groupMembers.find(member => member.role === "Leader") ? 
            group.groupMembers.find(member => member.role === "Leader").fullName : "N/A"
          }
        </td>
        <td className="align-middle">
          {group.mentor ? group.mentor.fullName : "N/A"}
        </td>
        <td className="align-middle">
          <Button color="info" size="sm" onClick={handleDetails}>
            <i className="fa fa-fw fa-eye"></i>
          </Button>
        </td>
      </tr>

      <ModalGroupDetails
        group={selectedGroup}
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        onDeleteMember={handleDeleteMember}
        fetchGroups={fetchGroups} 
        fetchStudentsWithoutGroup={fetchStudentsWithoutGroup}
      />
    </>
  );
};

TrTableGroupsList.propTypes = {
  group: PropTypes.shape({
    groupId: PropTypes.number.isRequired,
    groupName: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    groupMembers: PropTypes.array.isRequired,
    mentor: PropTypes.object, 
  }).isRequired,
  fetchGroups: PropTypes.func.isRequired,
  fetchStudentsWithoutGroup: PropTypes.func.isRequired,
};

export { TrTableGroupsList };
