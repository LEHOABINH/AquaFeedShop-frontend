import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { Link, useParams } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  CardHeader,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  UncontrolledButtonDropdown,
  Card,
  ButtonGroup,
  Button,
  CardBody,
  CardFooter,
  CardGroup,
  Table,
  TabPane,
  Badge,
  Nav,
  NavItem,
  UncontrolledTabs,
} from "../../../components";
import { HeaderMain } from "../Profile/components/HeaderMain";

import { Profile } from "../Profile/components/Profile";
import { ProfileOverviewCard } from "../Profile/components/ProfileOverviewCard";
import { DlRowContacts } from "../Profile/components/DlRowContacts";
import { DlRowAddress } from "../Profile/components/DlRowAddress";
import axios from "axios";
import { Avatar, AvatarAddOn } from "../../../components";
import config from './../../../../config';

const ViewProfile = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
  
    // Hàm gọi API để lấy thông tin user
    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await axios.get(`${config.apiBaseUrl}api/user/view-profile/${userId}`, {
              withCredentials: true,
            });
            if (response.data.success) {
              setUserData(response.data.data);
            } else {
              console.log("Error: ", response.data.errorMessage);
            }
          } catch (err) {
            setError('Lỗi khi lấy thông tin người dùng');
            console.error('Error fetching user profile:', err);
          }
        };
    
        fetchProfile();
      }, []);
    
      if (error) {
        return <div>{error}</div>;
      }
    
      if (!userData) {
        return <div>Loading...</div>; // Hiển thị trong khi chờ dữ liệu
      }
  
    // Lấy major từ students nếu có
    const major = userData.students?.[0]?.major;
    return (
        <React.Fragment>
            <Container>
            <HeaderMain title="Profile Details" className="mb-5 mt-4" />
            {/* START Content */}
            <Row className="d-flex align-items-stretch">
                <Col lg={4}>
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-center my-3">
                                <Avatar.Image
                                size="lg"
                                src={userData.avatar || "https://res.cloudinary.com/dan0stbfi/image/upload/v1722340236/xhy3r9wmc4zavds4nq0d.jpg"} // Hiển thị avatar nếu có
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
                            </div>
                            <div className="mb-4 text-center">
                                <a className="h6 text-decoration-none" href="#">
                                {userData.fullName || "User Name"}
                                </a>
                                {major && 
                                (
                                    <div className="text-center mt-2">{major}</div>
                                )}
                                <div className="text-center">
                                <i className="fa fa-map-marker mr-1"></i>
                                {userData.campus?.campusName || "Location"}  {/* Hiển thị địa điểm */}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={8}>
                    <Card className="shadow-sm border-0">
                        <CardBody>
                            {/* Contact Section */}
                            <div className="mb-4">
                                <h6 className="text-muted mb-3">Contact</h6>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted small">Phone</span>
                                    <span className="text-dark font-weight-medium">{userData.phone || 'No phone number information yet'}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted small">Email</span>
                                    <a
                                        href={`mailto:${userData.email}`}
                                        className="text-dark font-weight-medium text-decoration-none"
                                    >
                                        {userData.email || 'No email information yet'}
                                    </a>
                                </div>
                            </div>
                            <hr />
                            {/* Address Section */}
                            <div className="mt-4">
                                <h6 className="text-muted mb-3">Address</h6>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted small">Location</span>
                                    <span className="text-dark font-weight-medium">{userData.campus?.location || 'No location information yet'}</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {/* END Content */}
            </Container>
        </React.Fragment>
    );
};

export default ViewProfile;
