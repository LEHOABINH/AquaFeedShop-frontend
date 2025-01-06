import React, { useState, useEffect } from 'react'; 
import PropTypes from "prop-types";
import { useHistory } from 'react-router-dom';
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Media,
  Avatar,
  AvatarAddOn,
} from "../../../../components";
import ContactModal from './ContactModal';

const FindGroupContent = ({ data }) => {
  const history = useHistory();
  const [modalContactOpen, setModalContactOpen] = useState(false);
  const [selectedLeaderId, setSelectedLeaderId] = useState(null);

  const toggleModalContact = (leaderId) => {
    setSelectedLeaderId(leaderId);
    setModalContactOpen(!modalContactOpen);
  };

  const handleDetailsClick = (groupId) => {
    history.push({
      pathname: '/Views/Students/GroupsDetails',
      state: { groupId },
    });
  };

  return (
    <React.Fragment>
      {data.map((item, index) => (
        <tr key={index}>
          <td className="align-middle">{item.groupName}</td>
          <td className="align-middle">{item.description}</td>
          <td className="align-middle">{item.subjectCode}</td>
          <td className="align-middle">{item.memberCount}</td>
          <td className="align-middle">
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
          <td className="align-middle text-right">
            <UncontrolledButtonDropdown>
              <DropdownToggle color="link" className="text-decoration-none">
                <i className="fa fa-gear"></i>
                <i className="fa fa-angle-down ml-2"></i>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => handleDetailsClick(item.groupId)}>
                  <i className="fa fa-fw fa-envelope mr-2"></i>
                  Details
                </DropdownItem>
                <DropdownItem onClick={() => toggleModalContact(item.leaderId)}>
                  <i className="fa fa-fw fa-phone mr-2"></i>
                  Contact
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </td>
        </tr>
      ))}
    <ContactModal isOpen={modalContactOpen} toggle={toggleModalContact} contactedUserId = {selectedLeaderId}/>
    </React.Fragment>
  );
};

FindGroupContent.propTypes = {
  data: PropTypes.array.isRequired, // Đảm bảo data là một mảng
};

export { FindGroupContent };
