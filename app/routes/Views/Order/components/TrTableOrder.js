import React from "react";
import PropTypes from "prop-types";
import { CustomInput, Button, Media } from "../../../../components";

const TrTableOrder = ({ cart, selectedItems, handleSelectItem }) => (
  <React.Fragment>
    {cart.map((item, index) => (
      <tr key={index}>
        <td>
          <CustomInput
            type="checkbox"
            label=""
            id={`${item.cartId}`}
            checked={selectedItems.includes(item.cartId)}
            onChange={() => handleSelectItem(item.cartId)}
          />
        </td>
        <td>
          <Media>
            <Media left className="d-flex align-self-center mr-3">
              <img
                src={item.product.image}
                alt={item.product.productName}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                }}
              />
            </Media>
            <Media body>
              <h5 className="mt-0">{item.product.productName}</h5>
              <p className="mb-0 text-muted">{item.product.description}</p>
            </Media>
          </Media>
        </td>
        <td>{item.product.supplier.supplierName}</td>
        <td style={{ color: "black" }}>{item.price.toLocaleString("vi-VN")}đ</td>
        <td>{item.quantity}</td>
        <td style={{ color: "red" }}>
          {item.total.toLocaleString("vi-VN")}đ
        </td>
        <td className="text-right"><Button color="danger" >
          Xóa
        </Button></td>
      </tr>
    ))}
  </React.Fragment>
);

TrTableOrder.propTypes = {
  cart: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
};

export { TrTableOrder };
