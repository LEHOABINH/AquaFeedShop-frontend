import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import config from "../../../../../config";
import eventBus from "../../Utils/eventBus";
import { showToast } from "../../Utils/Toast";
import { Button } from "reactstrap";
import { useHistory } from "react-router-dom";
import { Card, CardBody, CardFooter } from "../../../../components";

const TasksCardGrid = ({ productName, price, description, productId, image }) => {
  const history = useHistory();

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}api/cart`,
        { productId, quantity: 0 }, // Mặc định quantity là 0
        { withCredentials: true }
      );

      if (response.data.success) {
        eventBus.emit("reloadCart"); // Phát sự kiện cập nhật giỏ hàng
        showToast("success", response.data.data.message || "Added to cart successfully!");
      } else {
        showToast("warning", response.data.data.message || "Failed to add to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleCardClick = () => {
    history.push(`/views/product-details/${productId}`); // Dùng history.push thay vì navigate
  };

  return (
    <React.Fragment>
      <Card>
        <CardBody onClick={handleCardClick} style={{ cursor: "pointer" }}>
          <img
            src={image}
            alt="Card image"
            style={{
              width: "100%",
              height: "220px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          />
          <p className="mb-2">{productName}</p>
          <p className="text-muted">{description}</p>
        </CardBody>

        <CardFooter className="d-flex">
          <span className="align-self-center" style={{ color: "red" }}>
            {price.toLocaleString("vi-VN")}đ
          </span>
          <Button
            color="primary"
            outline
            className="align-self-center ml-auto"
            onClick={handleAddToCart}
          >
            <i className="fa fa-fw fa-cart-plus" aria-hidden="true"></i> Add To Cart
          </Button>
        </CardFooter>
      </Card>
    </React.Fragment>
  );
};

TasksCardGrid.propTypes = {
  productName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  productId: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
};

export { TasksCardGrid };
