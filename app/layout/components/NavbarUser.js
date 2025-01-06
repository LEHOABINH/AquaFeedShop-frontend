import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  NavItem,
  NavLink
} from './../../components';
import { handleLogout } from './../../routes/Views/Auth/handleLogout';

const NavbarUser = (props) => {
  const history = useHistory();

  return (
    // Đảm bảo bạn trả về JSX hợp lệ
    <NavItem { ...props }>
      <NavLink onClick={() => handleLogout(history)}>
        <i className="fa fa-power-off"></i>
      </NavLink>
    </NavItem>
  );
};

NavbarUser.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object
};

export { NavbarUser };
