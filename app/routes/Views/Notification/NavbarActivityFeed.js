import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import axios from "axios";
import config from "./../../../../config";
import useAuth from "../../../../hooks/useAuth";

import {
  UncontrolledDropdown,
  DropdownToggle,
  IconWithBadge,
  Badge,
  ExtendedDropdown,
  ListGroup,
  ListGroupItem,
  Media,
  Button,
  Spinner
} from "./../../../components";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { showToast } from "./../Utils/Toast";
import InfiniteScroll from "react-infinite-scroll-component";
import getFormattedTime from './../Utils/timeFormatter';
import Cookies from 'js-cookie';
import { el } from "@faker-js/faker";

const NavbarActivityFeed = (props) => {
  const [notificationData, setNotificationData] = useState([]);
  const [unreadNotification, setUnreadNotification] = useState(0);
  const [notificationIndex, setNotificationIndex] = useState(0);
  const [hasMoreNotification, setHasMoreNotification] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const connection = useRef(null);
  const isInitialFetch = useRef(true);

  const loadMoreNotificationData = async () => {
    if (!isLoading && hasMoreNotification && !isInitialFetch.current) {
      setIsLoading(true);
      await fetchNotifications(notificationIndex + 1);
      setNotificationIndex(prev => prev + 1);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // connection.current = new HubConnectionBuilder()
    //   .withUrl(`${config.apiBaseUrl}notificationHub`)
    //   .withAutomaticReconnect()
    //   .build();

    //   const startConnection = async () => {
    //     try {
    //       await connection.current.start();
    //       console.log("SignalR Connected");
    //     } catch (err) {
    //       console.log("Error while starting connection:", err);
    //       setTimeout(() => startConnection(), 5000);
    //     }
    //   };

    // connection.current.on("ReceiveNotification", (notification) => {
    //   setNotificationData((prevData) => [notification, ...prevData]);
    //   setUnreadNotification((prev) => prev + 1);
    // });

    // startConnection();

    // return () => {
    //   connection.current.stop();
    // };
  }, []);

  const fetchNotifications = async (pageNumber) => {
    // try {
    //   const response = await axios.get(
    //     `${config.apiBaseUrl}api/notifications`,
    //     {
    //       params: {
    //         notificationIndex: pageNumber,
    //         limit: 10,
    //         keyword: "",
    //       },
    //       withCredentials: true
    //     }
    //   );
    //   if (response.data.success) {
    //     const newNotifications = response.data.data.notifications;
    //     if (pageNumber === 0) {
    //       setNotificationData(newNotifications);
    //     } else {
    //       setNotificationData((prevData) => [...prevData, ...newNotifications]);
    //     }
    //     setHasMoreNotification(newNotifications.length === 10);
    //     setUnreadNotification(response.data.data.unreadNotifications);
    //   } else {
    //     console.error(response.data.errorMessage);
    //   }
    // } catch (error) {
    //   console.error("Lỗi khi lấy thông báo:", error);
    // } finally {
    //   isInitialFetch.current = false;
    // }
  };

  //Fetch Notification when load page
  useEffect(() => {
    fetchNotifications(0);
  }, []);

  const markNotificationsAsRead = async () => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}api/notifications/mark-as-read`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get('AccessToken')}`,
            'x-refresh-token': Cookies.get('RefreshToken')
          },
        }
      );
      if (response.data.success) setUnreadNotification(0);
      else 
      {
        console.error(response.data.errorMessage);
        setHasMoreNotification(false);
      }
    } catch (error) {
      console.error("Lỗi khi chuyển trạng thái thông báo:", error);
      setHasMoreNotification(false);
    }
  };

  //Fetch Notification click the bell
  const handleFetchNotifications = async () => {
    isInitialFetch.current = true;
    setNotificationIndex(0);
    setHasMoreNotification(true);
    setNotificationData([]);
    await markNotificationsAsRead();
    await fetchNotifications(0);
  };

  const handleChoiceGroupInvite = async (
    choice,
    notificationId,
    groupId,
    inviteeId
  ) => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}api/notifications/group-invite/response`,
        {
          choice: choice,
          notificationId: notificationId,
          groupId: groupId,
          inviteeId: inviteeId,
        },
        {
          withCredentials: true
        }
      );
      if (response.data.success) {
        showToast("success", response.data.data);
        setNotificationData([])
        fetchNotifications(0);
      } else{
        showToast("error", response.data.errorMessage);
      }
    } catch (error) {
      console.error("Lỗi khi từ chối yêu cầu:", error);
    }
  };

  return (
    <UncontrolledDropdown nav inNavbar {...props}>
      <DropdownToggle nav onClick={handleFetchNotifications}>
        <IconWithBadge
          badge={
            unreadNotification > 0 ? (
              <Badge pill color="primary">
                {unreadNotification}
              </Badge>
            ) : (
              <Badge pill color="primary"></Badge>
            )
          }
        >
          <i className="fa fa-bell-o fa-fw" />
        </IconWithBadge>
      </DropdownToggle>
      <ExtendedDropdown right>
        <ExtendedDropdown.Section className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Activity Feed</h6>
        </ExtendedDropdown.Section>

        <ExtendedDropdown.Section
          list
          style={{
            height: "400px",
            overflow: "hidden"
          }}
        >
          <div
            id="scrollableDiv"
            style={{
              height: "100%",
              overflow: "auto",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <InfiniteScroll
              dataLength={notificationData.length}
              next={loadMoreNotificationData}
              hasMore={hasMoreNotification}
              loader={
                <div className="text-center py-2">
                  <Spinner color="primary" size="sm" />
                </div>
              }
              scrollableTarget="scrollableDiv"
              endMessage={
                <p className="text-center text-muted py-2 small">
                  No more notifications
                </p>
              }
            >
              <ListGroup>
                {notificationData.map((data, index) => (
                  <ListGroupItem key={index} action>
                    <Media>
                      <Media left>
                        {data.type === "Info" ? (
                          <span className="fa-stack fa-lg fa-fw d-flex mr-3">
                            <i className="fa fa-circle fa-fw fa-stack-2x text-primary"></i>
                            <i className="fa fa-info fa-stack-1x fa-fw text-white"></i>
                          </span>
                        ) : (
                          <span className="fa-stack fa-lg fa-fw d-flex mr-3">
                            <i className="fa fa-circle fa-fw fa-stack-2x text-primary"></i>
                            <i className="fa fa-users fa-stack-1x fa-fw text-white"></i>
                          </span>
                        )}
                      </Media>
                      <Media body>
                        <p
                          className="mt-2 mb-1"
                          dangerouslySetInnerHTML={{ __html: data.message }}
                        ></p>
                        <div className="small mt-2">{getFormattedTime(data.createdAt)}</div>
                        {data.type === "Group_Request" &&
                          (data.groupInvites[0].status === "Pending" ? (
                            <div className="mt-3 d-flex">
                              <Button
                                color="primary"
                                onClick={() =>
                                  handleChoiceGroupInvite(
                                    "Accept",
                                    data.notificationId,
                                    data.groupInvites[0].groupId,
                                    data.groupInvites[0].inviteeId
                                  )
                                }
                                className="mr-2"
                              >
                                Accept
                              </Button>
                              <Button
                                color="secondary"
                                onClick={() =>
                                  handleChoiceGroupInvite(
                                    "Reject",
                                    data.notificationId,
                                    data.groupInvites[0].groupId,
                                    data.groupInvites[0].inviteeId
                                  )
                                }
                              >
                                Reject
                              </Button>
                            </div>
                          ) : data.groupInvites[0].status === "Expired" ? (
                            <div className="mt-3 d-flex">
                              <span style={{ color: 'red' }}>This invitation has expired.</span>
                            </div>
                          ) : null)
                        }
                      </Media>
                    </Media>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </InfiniteScroll>
          </div>
        </ExtendedDropdown.Section>
      </ExtendedDropdown>
    </UncontrolledDropdown>
  );
};
NavbarActivityFeed.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export { NavbarActivityFeed };
