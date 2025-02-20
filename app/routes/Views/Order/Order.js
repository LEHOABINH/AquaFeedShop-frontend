import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../../../../config";

import {
  Container,
  Row,
  Col,
  ButtonToolbar,
  Card,
  Button,
  ButtonGroup,
  CardBody,
  CardFooter,
  CustomInput,
  Table,
  InputGroup,
  InputGroupAddon,
  Input,
  UncontrolledTooltip,
} from "../../../components";

import { HeaderMain } from "../../components/HeaderMain";
import { MailboxLeftNav } from "../../components/Mailbox/MailboxLeftNav";
import { Paginations } from "../../components/Paginations";
import { TrTableOrder } from "./components/TrTableOrder";

const Order = () => {
  const [data, setData] = useState([]); // State lưu trữ dữ liệu giỏ hàng
  const [selectAll, setSelectAll] = useState(false); // Trạng thái của checkbox Select All
  const [selectedItems, setSelectedItems] = useState([]); // Mảng lưu các sản phẩm đã chọn
  const [totalAmount, setTotalAmount] = useState(0); // Tổng số tiền

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
  }, []);

  // Hàm xử lý khi click vào checkbox "Select All"
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const allItems = data.map(item => item.cartId); // Chọn tất cả các item
      setSelectedItems(allItems);

      // Tính tổng số tiền của tất cả các item
      const total = data.reduce((sum, item) => sum + item.total, 0);
      setTotalAmount(total);
    } else {
      setSelectedItems([]); // Bỏ chọn tất cả các item
      setTotalAmount(0);
    }
  };

  // Hàm xử lý khi click vào checkbox của từng item
  const handleSelectItem = (cartId) => {
    let updatedSelectedItems;

    if (selectedItems.includes(cartId)) {
      updatedSelectedItems = selectedItems.filter(id => id !== cartId); // Bỏ chọn item
    } else {
      updatedSelectedItems = [...selectedItems, cartId]; // Chọn item
    }

    setSelectedItems(updatedSelectedItems);

    // Tính tổng số tiền từ các item được chọn
    const total = data
      .filter(item => updatedSelectedItems.includes(item.cartId))
      .reduce((sum, item) => sum + item.total, 0);

    setTotalAmount(total);
  };

  const handlePayment = () => {
    // Xử lý thanh toán
    alert(`Đang thanh toán số tiền: ${totalAmount.toLocaleString("vi-VN")}đ`);
  };

  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col lg={12}>
            <Card className="mb-3">
              <CardBody>
                <div className="d-lg-flex justify-content-end">
                  <div className="mr-auto d-flex align-items-center mb-3 mb-lg-0">
                    <InputGroup>
                      <Input placeholder="Search for..." />
                      <InputGroupAddon addonType="append">
                        <Button color="secondary" outline>
                          <i className="fa fa-search"></i>
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                  <ButtonToolbar>
                    <ButtonGroup className="mr-2">
                      <Button
                        color="link"
                        className="text-decoration-none align-self-center"
                        id="tooltipDelete"
                      >
                        <i className="fa fa-fw fa-trash"></i>
                      </Button>
                      <UncontrolledTooltip
                        placement="bottom"
                        target="tooltipDelete"
                      >
                        Delete
                      </UncontrolledTooltip>
                    </ButtonGroup>
                    <ButtonGroup className="ml-auto ml-lg-0">
                      <Button
                        color="primary"
                        className="align-self-center"
                        tag={Link}
                        to="/apps/new-email"
                        id="tooltipAddNew"
                      >
                        <i className="fa fa-fw fa-pencil"></i>
                      </Button>
                      <UncontrolledTooltip
                        placement="bottom"
                        target="tooltipAddNew"
                      >
                        Add New
                      </UncontrolledTooltip>
                    </ButtonGroup>
                  </ButtonToolbar>
                </div>
              </CardBody>
              {/* START Table */}
              <Table className="mb-0" hover responsive>
                <thead>
                  <tr>
                    <th className="bt-0">
                      <CustomInput
                        type="checkbox"
                        label=""
                        id="selectAll"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="bt-0" style={{ fontSize: '18px' }}>Sản Phẩm</th>
                    <th className="bt-0" style={{ fontSize: '18px' }}>Nhà Phân Phối</th>
                    <th className="bt-0" style={{ fontSize: '18px' }}>Đơn Giá</th>
                    <th className="bt-0" style={{ fontSize: '18px' }}>Số Lượng</th>
                    <th className="bt-0" style={{ fontSize: '18px' }}>Số Tiền</th>
                    <th className="text-right bt-0" style={{ fontSize: '18px' }}>Thao Tác</th>
                  </tr>
                </thead>

                <tbody>
                  {data.length > 0 ? (
                    <TrTableOrder
                      cart={data}
                      selectedItems={selectedItems}
                      handleSelectItem={handleSelectItem}
                    />
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {/* END Table */}
              {/* <CardFooter className="d-flex justify-content-center pb-0">
                <Paginations />
              </CardFooter> */}
              <CardFooter
                className="d-flex justify-content-between py-3"
                style={{
                  position: 'sticky',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: '#fff',
                  zIndex: 100,
                  boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)', // Tạo bóng cho phần footer
                }}
              >
                <div className="h5 mb-0">
                  Tổng Tiền: <strong style={{ color: "red", fontSize: "20px" }}>{totalAmount.toLocaleString("vi-VN")}đ</strong>
                </div>
                
                <Button color="primary" onClick={handlePayment}>
                  Thanh Toán
                </Button>
              </CardFooter>

            </Card>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Order;
