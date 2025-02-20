import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import config from "../../../../../config";
import eventBus from "../../Utils/eventBus";

import {
  UncontrolledDropdown,
  DropdownToggle,
  IconWithBadge,
  Badge,
  ExtendedDropdown,
  ListGroup,
  ListGroupItem,
  Media,
} from "../../../../components";

const NavbarCart = ({ ...props }) => {
  const [data, setData] = useState([]); // State lưu trữ dữ liệu giỏ hàng

  // Fetch cart data from API
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}api/cart`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setData(response.data.data);
      } else {
        console.error("Failed to fetch");
      }
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchCart();

    // Lắng nghe sự kiện từ eventBus
    eventBus.on("reloadCart", fetchCart);

    return () => {
      eventBus.off("reloadCart", fetchCart); // Cleanup sự kiện
    };
  }, []);

  return (
    <UncontrolledDropdown nav inNavbar {...props}>
      <DropdownToggle nav>
        <IconWithBadge
          badge={
            <Badge pill color="secondary">
              {data.length} {/* Hiển thị số lượng dữ liệu */}
            </Badge>
          }
        >
          <i className="fa fa-fw fa-shopping-cart" />
        </IconWithBadge>
      </DropdownToggle>
      <ExtendedDropdown right>
        <ExtendedDropdown.Section className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Cart</h6>
        </ExtendedDropdown.Section>

        <ExtendedDropdown.Section list>
          <ListGroup>
            {data.length > 0 ? (
              data.map((item, i) => (
                <ListGroupItem
                  tag={ExtendedDropdown.Link}
                  to={`/views/product-details/${item.product.productId}`} // Thay đổi đường dẫn thành productId
                  key={i}
                  action
                >
                  <Media>
                    <Media left>
                      <img
                        src={item.product.image}
                        alt={item.product.productName}
                        className="mr-4"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      />
                    </Media>
                    <Media body>
                      <span className="d-flex justify-content-start">
                        <span className="h6 pb-0 mb-0 d-flex align-items-center">
                          {item.product.productName}
                        </span>
                        <span className="ml-1 small">({item.quantity})</span>
                        <span className="ml-auto small">{item.price.toLocaleString("vi-VN")}đ</span>
                      </span>
                      <p className="mt-2 mb-1">{item.product.description}</p>
                    </Media>
                  </Media>
                </ListGroupItem>

              ))
            ) : (
              <ListGroupItem>No cart</ListGroupItem>
            )}
          </ListGroup>
        </ExtendedDropdown.Section>

        <ExtendedDropdown.Section
          className="text-center"
          tag={ExtendedDropdown.Link}
          to="/views/order"
        >
          View All
          <i className="fa fa-angle-right fa-fw ml-2" />
        </ExtendedDropdown.Section>
      </ExtendedDropdown>
    </UncontrolledDropdown>
  );
};

NavbarCart.propTypes = {
  index: PropTypes.number.isRequired,
};

export { NavbarCart };
