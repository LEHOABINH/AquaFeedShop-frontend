import React from "react";
import { faker } from "@faker-js/faker";
import PropTypes from "prop-types";
import { Button } from 'reactstrap'; // Import Button từ reactstrap hoặc từ component của bạn
import { Link } from "react-router-dom";

import {
  Card,
  CardBody,
  Badge,
  Avatar,
  Media,
  CustomInput,
  CardFooter,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  AvatarAddOn,
} from "./../../../components";

const TasksCardGrid = (props) => (
  <React.Fragment>
    {/* START Card */}
    <Card>
      <CardBody>
        <img
          src="https://res.cloudinary.com/dan0stbfi/image/upload/v1734358292/cd7a39c1ff9b42c51b8a_ycllbn.jpg"
          alt="Card image"
          style={{ width: '100%', height: '220px', borderRadius: '8px', marginBottom: '10px' }}
        />
        <p className="mb-2">Đồ ăn cho tôm</p>
      </CardBody>

      <CardFooter className="d-flex">
        <span className="align-self-center" style={{ color: 'red' }}>10,000,000đ</span>
        <Button
          color="primary" // Màu của nút
          outline // Nút có viền
          className="align-self-center ml-auto" // Căn chỉnh nút
          onClick={() => handleDetail(item.groupId)} // Xử lý khi click
        >
          Add To Cart
        </Button>
      </CardFooter>
    </Card>
    {/* END Card */}
  </React.Fragment>
);

TasksCardGrid.propTypes = {
  id: PropTypes.node,
};
TasksCardGrid.defaultProps = {
  id: "1",
};

export { TasksCardGrid };
