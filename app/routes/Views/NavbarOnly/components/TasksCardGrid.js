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
} from "./../../../../components";



const TasksCardGrid = ({ productName, price, description, productId, image }) => (
  <React.Fragment>
      <Card>
          <CardBody>
              <img
                  src={image}
                  alt="Card image"
                  style={{ width: '100%', height: '220px', borderRadius: '8px', marginBottom: '10px' }}
              />
              <p className="mb-2">{productName}</p>
              <p className="text-muted">{description}</p>
          </CardBody>

          <CardFooter className="d-flex">
              <span className="align-self-center" style={{ color: 'red' }}>
                  {price.toLocaleString('vi-VN')}đ
              </span>
              <Button
                  color="primary"
                  outline
                  className="align-self-center ml-auto"
                  onClick={() => handleDetail(productId)}
              >
                  Add To Cart
              </Button>
          </CardFooter>
      </Card>
  </React.Fragment>
);

TasksCardGrid.propTypes = {
  productName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  productId: PropTypes.number.isRequired,
};

export { TasksCardGrid };
