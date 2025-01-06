import React, { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import { Link } from "react-router-dom";

import {
  Sidebar,
  UncontrolledButtonDropdown,
  Avatar,
  AvatarAddOn,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "./../../../components";
import { randomAvatar } from "./../../../utilities";
import useAuth from "../../../../hooks/useAuth";
import { useHistory } from 'react-router-dom';
import { handleLogout } from './../../../routes/Views/Auth/handleLogout';

const SidebarTopA = () => {
  const history = useHistory();
  const avatarImg = randomAvatar();
  const { id, username, role, email, avatar } = useAuth();
  return (
    <React.Fragment>
      {/* START: Sidebar Default */}
      <Sidebar.HideSlim>
        <Sidebar.Section className="pt-0">
          <Link to="#" className="d-block">
            <Sidebar.HideSlim>
              <Avatar.Image
                size="lg"
                src={avatar}
              />
            </Sidebar.HideSlim>
          </Link>

          <UncontrolledButtonDropdown>
            <DropdownToggle
              color="link"
              className="pl-0 pb-0 btn-profile sidebar__link"
            >
              {username}
              <i className="fa fa-angle-down ml-2"></i>
            </DropdownToggle>
            <DropdownMenu persist>
              <DropdownItem header>
                {role}
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem tag={Link} to="/Views/Profile/ProfileDetails">
                My Profile
              </DropdownItem>
              {/* <DropdownItem tag={Link} to="/apps/settings-edit">
                Settings
              </DropdownItem>
              <DropdownItem tag={Link} to="/apps/billing-edit">
                Billings
              </DropdownItem> */}
              <DropdownItem divider />
              <DropdownItem onClick={() => handleLogout(history)}>
                <i className="fa fa-fw fa-sign-out mr-2"></i>
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
          <div className="small sidebar__link--muted">
            {email}
          </div>
        </Sidebar.Section>
      </Sidebar.HideSlim>
      {/* END: Sidebar Default */}

      {/* START: Sidebar Slim */}
      <Sidebar.ShowSlim>
        <Sidebar.Section>
          <Avatar.Image
            size="sm"
            src={avatarImg}
            addOns={[
              <AvatarAddOn.Icon
                className="fa fa-circle"
                color="white"
                key="avatar-icon-bg"
              />,
              <AvatarAddOn.Icon
                className="fa fa-circle"
                color="success"
                key="avatar-icon-fg"
              />,
            ]}
          />
        </Sidebar.Section>
      </Sidebar.ShowSlim>
      {/* END: Sidebar Slim */}
    </React.Fragment>
  );
};

export { SidebarTopA };
