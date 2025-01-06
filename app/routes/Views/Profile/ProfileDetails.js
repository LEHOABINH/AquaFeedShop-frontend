import React, { useEffect, useState } from "react";
import axios from "axios";
import { faker } from "@faker-js/faker";
import { Link } from "react-router-dom";
import config from "./../../../../config"; // Nhập config

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

const ProfileDetails = () => {
  const [workshopCount, setWorkshopCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    // const fetchMeetingSchedules = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${config.apiBaseUrl}api/meeting-schedules/events`,
    //       { withCredentials: true }
    //     );
    //     const count = response.data?.data?.length || 0; // Đếm số sự kiện
    //     setEventCount(count);

    //   } catch (error) {
    //     console.error(
    //       "Error fetching meeting schedules:",
    //       error.response?.data || error.message
    //     );
    //   }
    // };

    // const fetchWorkshops = async () => {
    //   try {
    //     const response = await axios.get(`${config.apiBaseUrl}api/workshop`, {
    //       withCredentials: true,
    //     });
    //     const count = response.data?.data?.length || 0; // Đếm số workshop
    //     setWorkshopCount(count);

    //   } catch (error) {
    //     console.error(
    //       "Error fetching workshops:",
    //       error.response?.data || error.message
    //     );
    //   }
    // };

    // fetchMeetingSchedules();
    // fetchWorkshops();
  }, []);



  return (
    <React.Fragment>
      <Container>
        <HeaderMain title="Profile" className="mb-5 mt-4" />
        {/* START Content */}
        <Row>
          <Col lg={4}>
            <Card>
              <CardBody>
                <Profile />
                {/* <div className="text-center pb-1">
                  <ul className="list-inline">
                    <li className="list-inline-item text-center">
                      <h2 className="mb-1">{workshopCount}</h2>
                      <span>Workshops</span>
                    </li>
                    <li className="list-inline-item text-center">
                      <h2 className="mb-1">{eventCount}</h2>
                      <span>Events</span>
                    </li>
                  </ul>
                </div> */}
                <Row className="mt-3">
                  <Col sm={12} md={12}>
                    <Button
                      color="secondary"
                      outline
                      block
                      tag={Link}
                      to="/Views/Profile/ProfileEdit"
                    >
                      Edit
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg={8}>
            <UncontrolledTabs initialActiveTabId="detailContact">
              {/* START Pills Nav */}
              <Nav pills className="mb-4 flex-column flex-md-row mt-4 mt-lg-0">
                {/* <NavItem>
                  <UncontrolledTabs.NavLink tabId="overview">
                    Overview
                  </UncontrolledTabs.NavLink>
                </NavItem> */}
                <NavItem>
                  <UncontrolledTabs.NavLink tabId="detailContact">
                    Detail Contact
                  </UncontrolledTabs.NavLink>
                </NavItem>
              </Nav>
              {/* END Pills Nav */}
              <UncontrolledTabs.TabContent>
                {/* <TabPane tabId="overview">
                  <CardGroup className="mb-5">
                    <Card body>
                      <ProfileOverviewCard
                        title="Views"
                        badgeColor="primary"
                        badgeTitle="Monthly"
                        value="6.200"
                        valueTitle="Total Views"
                        footerTitle="Last Month"
                        footerTitleClassName="text-success"
                        footerIcon="caret-up"
                        footerValue="23%"
                      />
                    </Card>
                    <Card body>
                      <ProfileOverviewCard
                        title="Orders"
                        badgeColor="info"
                        badgeTitle="Annual"
                        value="75.938"
                        valueTitle="New Orders"
                        footerTitle="Last Annual"
                        footerTitleClassName="text-danger"
                        footerIcon="caret-down"
                        footerValue="96%"
                      />
                    </Card>
                    <Card body>
                      <ProfileOverviewCard
                        title="Visits"
                        badgeColor="secondary"
                        badgeTitle="Today"
                        value="75.938"
                        valueTitle="Total Visits"
                        footerTitle="Yesterday"
                        footerTitleClassName="text-success"
                        footerIcon="caret-up"
                        footerValue="40%"
                      />
                    </Card>
                  </CardGroup>
                </TabPane> */}
                <TabPane tabId="detailContact">
                  <Card body>
                    <div className="mb-2">
                      <span className="small">Contact</span>
                    </div>
                    <DlRowContacts
                      leftSideClassName="text-lg-right"
                      rightSideClassName="text-inverse"
                    />
                    <div className="mt-4 mb-2">
                      <span className="small">Address</span>
                    </div>
                    <DlRowAddress
                      leftSideClassName="text-lg-right"
                      rightSideClassName="text-inverse"
                    />
                  </Card>
                </TabPane>
              </UncontrolledTabs.TabContent>
            </UncontrolledTabs>
          </Col>
        </Row>
        {/* END Content */}
      </Container>
    </React.Fragment>
  );
};

export default ProfileDetails;
