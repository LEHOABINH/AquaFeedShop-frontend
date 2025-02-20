import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../../../config';
import { Link } from "react-router-dom";
import { showToast } from "../Utils/Toast";
import eventBus from "../Utils/eventBus";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  CardBody,
  CardFooter,
  ButtonToolbar,
  Badge,
  UncontrolledTooltip,
} from '../../../components';

const ProductDetailKanban = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Kiểm soát chế độ chỉnh sửa input

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}api/product/${productId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const { product, user } = response.data.data;
        setProduct(product);
        setUser(user);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('An error occurred while fetching the product.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}api/cart`,
        { productId, quantity },
        { withCredentials: true }
      );

      if (response.data.success) {
        eventBus.emit("reloadCart");
        showToast("success", response.data.data.message || "Added to cart successfully!");
      } else {
        showToast("warning", response.data.data.message || "Failed to add to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      return newQuantity <= product?.stock ? newQuantity : product?.stock; // Kiểm tra số lượng không vượt quá stock
    });
  };


  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // Chỉ cho phép nhập số
      const parsedValue = value === "" ? "" : Math.max(1, parseInt(value, 10));
      // Kiểm tra nếu giá trị nhập lớn hơn số lượng có sẵn
      if (parsedValue > product?.stock) {
        setQuantity(product?.stock); // Đặt lại số lượng bằng số lượng có sẵn
      } else {
        setQuantity(parsedValue);
      }
    }
  };


  const handleInputBlur = () => {
    if (quantity === "" || quantity < 1) {
      setQuantity(1); // Đặt lại giá trị mặc định nếu rỗng hoặc không hợp lệ
    }
    setIsEditing(false); // Thoát chế độ chỉnh sửa
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <React.Fragment>
      <Container style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <Row>
          <Col lg={5}>
            <img
              src={product?.image}
              alt="Card image"
              style={{ width: "100%", height: "500px", borderRadius: "8px" }}
            />
          </Col>
          <Col lg={7}>
            <Card className="mb-3">
              <CardBody>
                <div className="d-lg-flex justify-content-end mb-4">
                  <div className="mr-auto d-flex align-items-center mb-3 mb-xl-0">
                    <h3>{product?.productName}</h3>
                  </div>
                  <ButtonToolbar>
                    <ButtonGroup className="mr-2">
                      <Button color="link" className="text-decoration-none align-self-center" id="tooltipFav">
                        <i className="fa fa-fw fa-star"></i>
                      </Button>
                      <UncontrolledTooltip placement="bottom" target="tooltipFav">
                        Add to Favorites
                      </UncontrolledTooltip>
                    </ButtonGroup>
                    <ButtonGroup className="ml-auto ml-lg-0">
                      <Button color="primary" className="align-self-center" tag={Link} to="/views/home" id="tooltipReply">
                        <i className="fa fa-fw fa-reply"></i>
                      </Button>
                      <UncontrolledTooltip placement="bottom" target="tooltipReply">
                        Go back
                      </UncontrolledTooltip>
                    </ButtonGroup>
                  </ButtonToolbar>
                </div>
                <div className="mb-4">
                  <hr />
                  <div className="d-flex mb-3">
                    <h5>{product?.description}</h5>
                    <Badge pill color="primary" className="ml-auto align-self-start">
                      Yêu Thích
                    </Badge>
                  </div>
                  <div style={{ marginTop: "10px", backgroundColor: "#f8f9fa", padding: "10px" }}>
                    <div className="IZPeQz B67UQ0" style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}>
                      {Number(product?.price).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div style={{ marginBottom: '20px' }}><strong>Nhà Cung Cấp:</strong> <span style={{ color: 'black' }}>{product?.supplier?.supplierName}</span></div>
                  <div style={{ marginBottom: '20px' }}><strong>Chủ Đại Lý:</strong> <span style={{ color: 'black' }}>{user?.fullName}</span></div>
                  <div style={{ marginBottom: '20px' }}><strong>SĐT:</strong> <span style={{ color: 'black' }}>{user?.phone}</span></div>
                  <div style={{ marginBottom: '20px' }}><strong>Địa Chỉ:</strong> <span style={{ color: 'black' }}>{user?.address}</span></div>
                  <div><strong>Có Sẵn:</strong> <span style={{ color: 'black' }}>{product?.stock}</span></div>
                </div>
                <div>
                  <div className="d-flex align-items-center">
                    <span style={{ marginRight: "15px", fontSize: "20px" }}>Số lượng:</span>
                    <Button color="danger" onClick={handleDecrease}>
                      <i className="fa fa-minus"></i>
                    </Button>
                    {isEditing ? (
                      <input
                        type="text"
                        value={quantity}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        autoFocus
                        style={{
                          margin: "0 15px",
                          fontSize: "20px",
                          width: "50px",
                          textAlign: "center",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          margin: "0 15px",
                          fontSize: "20px",
                          color: "black",
                          cursor: "pointer",
                          border: "1px solid #ddd",
                          padding: "8px 18px", // Giảm padding trên và dưới để giảm chiều cao
                          borderRadius: "4px",
                          lineHeight: "20px", // Điều chỉnh lineHeight để căn giữa nội dung nếu cần
                        }}
                        onClick={() => setIsEditing(true)}
                      >
                        {quantity}
                      </span>

                    )}
                    <Button color="success" onClick={handleIncrease}>
                      <i className="fa fa-plus"></i>
                    </Button>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <ButtonToolbar className="flex-column flex-lg-row">
                  <ButtonToolbar className="flex-column flex-sm-row ml-0 ml-lg-auto">
                    <ButtonGroup className="ml-0 ml-md-auto m-lg-0">
                      <Button color="primary" outline className="align-self-center ml-auto" onClick={handleAddToCart}>
                        <i className="fa fa-fw fa-cart-plus" aria-hidden="true"></i> Add To Cart
                      </Button>
                    </ButtonGroup>
                  </ButtonToolbar>
                </ButtonToolbar>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default ProductDetailKanban;
