// TrTableUsersList.js
import React from "react";
import PropTypes from "prop-types";
import {
  Media,
  Avatar,
  AvatarAddOn,
  CustomInput,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "./../../../../components";
import useAuth from "../../../../../hooks/useAuth";

const TrTableUsersList = ({ user, onEdit, onDelete }) => {
  const { hasPermission } = useAuth();
  return (
    <tr>
      <td>
        <Media>
          <Media left className="d-flex align-self-center mr-3">
            <Avatar.Image size="md" src={user.avatar} className="align-self-center" />
          </Media>
          <Media body>
            <a className="mt-0 d-flex text-decoration-none" href="#">
              {user.fullName}
            </a>
          </Media>
        </Media>
      </td>
      <td className="align-middle">{user.email}</td>
      <td className="align-middle">{user.phone}</td>
      <td className="align-middle">{user.campus.campusName}</td>
      <td className="align-middle">{user.role.name}</td>
      <td className="align-middle text-right">
        <UncontrolledButtonDropdown>
          <DropdownToggle color="link" className="pr-0">
            <i className="fa fa-bars"></i>
            <i className="fa fa-angle-down ml-2" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem 
              onClick={onEdit} 
              style={{
                opacity: hasPermission("edit_user") ? 1 : 0.6
              }}
              disabled={!hasPermission("edit_user")}
            >
              <i className="fa fa-fw fa-pencil mr-2"></i>Edit
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem 
              onClick={onDelete} 
              style={{
                opacity: hasPermission("delete_user") ? 1 : 0.6
              }}
              disabled={!hasPermission("delete_user")}
            >

              <i className="fa fa-fw fa-trash mr-2"></i>Delete
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </td>
    </tr>
  );
};

TrTableUsersList.propTypes = {
  user: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export { TrTableUsersList };
