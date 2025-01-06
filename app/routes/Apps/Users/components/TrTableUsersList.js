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

const TrTableUsersList = ({ user }) => {
  return (
    <React.Fragment>
      <tr>
        <td className="align-middle">
          <CustomInput
            type="checkbox"
            id={`TrTableUsersList-${user.userId}`} // Sử dụng user.userId để làm id
            label=""
            inline
          />
        </td>
        <td className="align-middle">
          <a href="#">
            <i className="fa fa-fw fa-star-o"></i>
          </a>
        </td>
        <td>
          <Media>
            <Media left className="d-flex align-self-center mr-3">
              <Avatar.Image
                size="md"
                src={user.avatarUrl || "default-avatar-url"} // Thay đổi đường dẫn đến avatar từ user
                className="align-self-center"
                addOns={[<AvatarAddOn.Icon className="fa fa-circle" color="white" key="avatar-icon-white-bg" />]}
              />
            </Media>
            <Media body>
              <a className="mt-0 d-flex text-decoration-none" href="#">
                {user.fullName} {/* Sử dụng trường fullName từ user */}
              </a>
              <span>{user.role.name}</span> {/* Sử dụng trường role.name từ user */}
            </Media>
          </Media>
        </td>
        <td className="align-middle">{user.email}</td> {/* Sử dụng trường email từ user */}
        <td className="align-middle">{user.phone}</td> {/* Sử dụng trường phone từ user */}
        <td className="align-middle text-right">
          <UncontrolledButtonDropdown>
            <DropdownToggle color="link" className="pr-0">
              <i className="fa fa-bars"></i>
              <i className="fa fa-angle-down ml-2" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <i className="fa fa-fw fa-comment mr-2"></i>
                Chat
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-fw fa-user mr-2"></i>
                Profile
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-fw fa-pencil mr-2"></i>
                Edit
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                <i className="fa fa-fw fa-trash mr-2"></i>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </td>
      </tr>
    </React.Fragment>
  );
};

TrTableUsersList.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string, // Thêm trường avatarUrl nếu có
    role: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export { TrTableUsersList };
