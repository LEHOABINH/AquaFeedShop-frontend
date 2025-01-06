import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import config from "./../../../../config";
import useAuth from "../../../../hooks/useAuth";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import {
  Container,
  Row,
  CardBody,
  Col,
  CardHeader,
  Card,
  CardFooter,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  Button,
  Input,
  Nav,
  NavItem,
  Media,
  Avatar,
  NavLink,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
  Table,
  Spinner,
} from "./../../../components";
import { randomAvatar } from "./../../../utilities";
import InfiniteScroll from "react-infinite-scroll-component";
import getFormattedTime from './../Utils/timeFormatter';
import { showToast } from "./../Utils/Toast";
import { Link } from "react-router-dom";
import ContactModal from './../Students/components/ContactModal';
import ConfirmDeleteMessageModal from "./components/ModelDeleteMessage";


const Clients = () => {
  const [isLoading, setIsLoading] = useState(true);
  //Chat groups
  const [chatData, setChatData] = useState([]);
  //Keyword search
  const [searchChatGroup, setSearchChatGroup] = useState("");
  //Messages in chat group
  const [chatGroupData, setChatGroupData] = useState([]);
  //Members in chat group
  const [membersInChatGroupData, setMembersInChatGroupData] = useState([]);
  const [connection, setConnection] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  //Current chat group data
  const [currentGroup, setcurrentGroup] = useState(null);
  const [currentChatGroupId, setCurrentChatGroupId] = useState(null);
  const [currentChatGroupName, setCurrentChatGroupName] = useState("");
  const [currentChatGroupType, setCurrentChatGroupType] = useState("");

  //Properties for personal chat
  const [currentStudentCode, setCurrentStudentCode] = useState(null);
  const [currentUserIdForPersonalChat, setCurrentUserIdForPersonalChat] = useState(null);

  //Select User Id To Contact
  const [selectedContactedUserId, setSelectedContactedUserId] = useState(null);

  const [currentSelectedUserId, setCurrentSelectedUserId] = useState(null);
  const { id, username } = useAuth();
  const messagesEndRef = useRef(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  //Load more chat group
  const [chatGroupIndex, setChatGroupIndex] = useState(0);
  const [hasMoreChatGroup, setHasMoreChatGroup] = useState(true);
  //Load more message
  const [messageIndex, setMessageIndex] = useState(0);
  const [hasMoreMessage, setHasMoreMessage] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  //Modal
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
  const [isViewMembersModalOpen, setIsViewMembersModalOpen] = useState(false);
  const [isConfirmKickMemberModalOpen, setIsConfirmKickMemberModalOpen] = useState(false);
  const [isConfirmDeleteGroupChatModalOpen, setIsConfirmDeleteGroupChatModalOpen] = useState(false);
  const [options, setOptions] = useState([]);
  //User sellected to add into chat group
  const [selectedUser, setSelectedUser] = useState([]);

  const [activeGroupId, setActiveGroupId] = useState(null);
  const [modalContactOpen, setModalContactOpen] = useState(false);

  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [hoverMessageState, setHoverMessageState] = useState({});
  const [messageOptions, setMessageOptions] = useState({});
  const [isConfirmDeleteMessageModalOpen, setIsConfirmDeleteMessageModalOpen] = useState(false);

  const handleShowMessageOptions = (messageId) => {
    setMessageOptions((prevOptions) => ({
      ...prevOptions,
      [messageId]: !prevOptions[messageId],
    }));
  };

  const handleHoverMessage = (messageId, isHovered) => {
    setHoverMessageState((prevState) => ({
      ...prevState,
      [messageId]: isHovered,
    }));
    if (!isHovered) setMessageOptions((prevOptions) => ({ ...prevOptions, [messageId]: false,
    }));
  };


  const toggleConfirmDeleteMessageModal = (messageId) => {
    setSelectedMessageId(messageId);
    setIsConfirmDeleteMessageModalOpen(!isConfirmDeleteMessageModalOpen);
};

  const handleMouseEnter = (groupId) => {
    if (groupId !== currentChatGroupId) {
      setActiveGroupId(groupId);
    }
  };

  const loadMoreChatGroupData = () => {
    console.log("Toi da den day");
    if (hasMoreChatGroup) {
      setChatGroupIndex((prev) => prev + 1);
    }
  };

  const loadMoreMessageData = () => setMessageIndex((prev) => prev + 1);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const toggleModalContact = (userId) => {
    setSelectedContactedUserId(userId);
    setModalContactOpen(!modalContactOpen);
  };

  const closeBothModals = () => {
    setModalContactOpen(false);
    setIsViewMembersModalOpen(false);
};

  const toggleConfirmKickMemberModal = (userId) => {
    setCurrentSelectedUserId(userId);
    toggleViewMembersModal();
    setIsConfirmKickMemberModalOpen((prevState) => !prevState);
  };

  const toggleConfirmDeleteGroupChatModal = () =>
    setIsConfirmDeleteGroupChatModalOpen((prevState) => !prevState);

  const toggleAddMembersModal = () =>
    setIsAddMembersModalOpen((prevState) => !prevState);

  const toggleViewMembersModal = async () => {
    const newState = !isViewMembersModalOpen;
    setIsViewMembersModalOpen(newState);

    if (newState) {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}api/chat-groups/${currentChatGroupId}/members`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setMembersInChatGroupData(response.data.data);
          console.log("Data set:", response.data.data);
        }
      } catch (error) {
        console.error("Không data!", error);
      }
    }
  };

  const handleSearch = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}api/user/student/search-studentcode`,
        {
          params: { query },
          withCredentials: true
        }
      );
      if (response.data.success) {
        setOptions(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching email suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMembers = async () => {
    if (currentGroup === null) {
        console.error('Group is missing.');
        return;
    }
    let studentCode = currentStudentCode;

    if (!studentCode) {
      studentCode = selectedUser[0]?.studentCode?.trim();
    }

    if (!studentCode) {
      console.error('Student code is missing or invalid.');
      return;
    }

    const requestData = {
        groupId: currentGroup.groupId,
        studentCode: studentCode
    };

    try {
        const response = await axios.post(`${config.apiBaseUrl}api/groupMember/AddMemberToGroup`, requestData, {
            withCredentials: true,
        });

        if (response.data.success) {
            showToast("success", response.data.data || "Group invitation sent!");
            setSelectedUser([]);
        }
    } catch (error) {
        const errorMessage = error.response?.data?.errorMessage || "Failed to add member.";
        showToast("error", errorMessage);
        console.error('Error add member: ', errorMessage);
    }
  };

  const handleKickMember = async () => {
    try {
      const response = await axios.delete(
        `${config.apiBaseUrl}api/chat-groups/remove`,
        {
          data: {
            userId: currentSelectedUserId,
            chatGroupId: currentChatGroupId,
          },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        showToast("success", response.data.data);
        toggleConfirmKickMemberModal();
        toggleViewMembersModal();
      } else {
        showToast("error", response.data.errorMessage);
      }
    } catch (error) {
      console.error("Error remove member:", error);
    } finally {
      setCurrentSelectedUserId(null);
    }
  };

  const handleDeleteGroupChat = () => {
    console.log("Xóa cuộc trò chuyện...");
    toggleConfirmDeleteGroupChatModal();
  };

  const handleSearchChatGroupChange = (e) => {
    setSearchChatGroup(e.target.value);
  };

  //Scroll when load message from chat group or load message when send a new message
  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [chatGroupData, shouldScrollToBottom]);

  useEffect(() => {
    handleFetchGroup()
  }, []);

  const handleFetchGroup = async () => {
      try {
  
        const response = await axios.get(
          `${config.apiBaseUrl}api/group/get-group`,
          { withCredentials: true }
        );
  
        if (response.data.success) {
          console.log("Group: ", response.data.data);
          setcurrentGroup(response.data.data);
        } else {
          console.log("Error: ", response.data.errorMessage);
        }
      } catch (error) {
        console.error('API Error:', error);
        showToast("error", `Error: ${error.response?.data || "Something went wrong!"}`);
      }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMessageScroll = (e) => {
    const element = e.target;
    const scrollThreshold = element.scrollHeight - element.clientHeight * 0.8;
    if (element.scrollTop >= scrollThreshold) {
      setShouldScrollToBottom(true);
    } else {
      setShouldScrollToBottom(false);
    }
  };

    //Config SignalR Connection
    useEffect(() => {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${config.apiBaseUrl}chathub`)
        .configureLogging(LogLevel.Information)
        .build();
  
      setConnection(newConnection);
  
      return () => {
        if (newConnection) {
          newConnection.stop();
        }
      }
    }, []);

  useEffect(() => {
    if (!connection) return;

    const connectSignalR = async () => {
      if (connection.state === "Disconnected") {
        try {
          await connection.start();
          console.log("SignalR Connected");
        } catch (err) {
          console.error("SignalR Connection Error: ", err);
        }
      }
    };

    const handleReceiveMessage = (message) => {
      if (message.chatMessage.chatGroupId === currentChatGroupId) {
        if (message.senderName === username) {
          message.senderName = "You";
        }
        setChatGroupData((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) => msg.chatMessage.messageId === message.chatMessage.messageId
          );
          if (messageExists) {
            return prevMessages;
          }
          return [message, ...prevMessages];
        });
      }
    };

    const handleUpdateChatGroupWhenReceiveMessages = (chatGroup, userIds) => {

      const userId = id && !isNaN(parseInt(id, 10)) ? parseInt(id, 10) : null;
      if (userId !== null && userIds.includes(userId)) {
        setChatData((prevChatGroups) => {
          const existingChatGroupIndex = prevChatGroups.findIndex(
            (chat) => chat.chatGroup.chatGroupId === chatGroup.chatGroup.chatGroupId
          );

          if (existingChatGroupIndex !== -1) {
            const updatedChatGroups = [...prevChatGroups];
            updatedChatGroups[existingChatGroupIndex] = {
              ...updatedChatGroups[existingChatGroupIndex],
              latestMessage: chatGroup.latestMessage,
              sendDatetime: chatGroup.sendDatetime,
            };
            
            // Move updated group to top
            const [updatedGroup] = updatedChatGroups.splice(existingChatGroupIndex, 1);
            return [updatedGroup, ...updatedChatGroups];
          }
          
          return [chatGroup, ...prevChatGroups];
        });
      }
    };

    const handleUpdateChatGroupWhenContact = (contactUserId) => {

      const userId = id && !isNaN(parseInt(id, 10)) ? parseInt(id, 10) : null;
      if (userId === contactUserId) {
        setChatData([]);
        fetchChatGroups(0, "");
        setChatGroupData([]);
      }
    };

    const handleUpdateMessageWhenChangeOccur = (updatedMessage) => {
      if (currentChatGroupId === updatedMessage.chatMessage.chatGroupId) {
        const userId = id && !isNaN(parseInt(id, 10)) ? parseInt(id, 10) : null;
        if (userId === updatedMessage.chatMessage.userId) updatedMessage.senderName = "You";
        setChatGroupData((prevMessages) => {
          return prevMessages.map((message) =>
            message.chatMessage.messageId === updatedMessage.chatMessage.messageId
              ? { ...message, ...updatedMessage }
              : message
          );
        });
      }
    };

    connectSignalR();
    connection.on("ReceiveMessages", handleReceiveMessage);
    connection.on("UpdateChatGroupWhenReceiveMessages", handleUpdateChatGroupWhenReceiveMessages);
    connection.on("UpdateChatGroupWhenContact", handleUpdateChatGroupWhenContact);
    connection.on("UpdateMessageWhenChangeOccur", handleUpdateMessageWhenChangeOccur);

    return () => {
      // Cleanup event listener when component unmounts or connection changes
      connection.off("ReceiveMessages", handleReceiveMessage);
    };
  }, [connection, currentChatGroupId, username, id]);

  const fetchChatGroups = useCallback(async (pageNumber, searchChatGroup) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}api/chat-groups/user`,
        {
          params: {
            chatGroupIndex: pageNumber,
            limit: 8,
            keyword: searchChatGroup,
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const newGroups = response.data.data;
        setChatData((prevData) => {
          const uniqueChatGroups = newGroups.filter(
            (newChatGroup) => !prevData.some(
              (existingChatGroup) => existingChatGroup.chatGroup.chatGroupId === newChatGroup.chatGroup.chatGroupId
            )
          );
          return [...prevData, ...uniqueChatGroups];
        });
        setHasMoreChatGroup(newGroups.length === 8);
      } else {
        console.error(response.data.errorMessage);
        setHasMoreChatGroup(false);
      }
    } catch (error) {
      console.error("Error fetching chat groups:", error);
      setHasMoreChatGroup(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChatGroups(chatGroupIndex, searchChatGroup);
  }, [chatGroupIndex, fetchChatGroups]);

  // useEffect(() => {
  //   if (connection && isFirstRender && chatData.length > 0) {
  //     const firstGroup = chatData[0];
  //     handleGroupClick(
  //       firstGroup.chatGroup.chatGroupId,
  //       firstGroup.chatGroup.chatGroupName,
  //       firstGroup.chatGroup.type,
  //       firstGroup.student?.studentCode,
  //       firstGroup.userId
  //     );
  //     setIsFirstRender(false);
  //   }
  // }, [connection, isFirstRender, chatData, handleGroupClick]);

  //When search, clear current chat group data, set index = 0
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    setChatData([]);
    if (chatGroupIndex === 0) fetchChatGroups(chatGroupIndex, searchChatGroup);
    else setChatGroupIndex(0);
  }, [searchChatGroup]);

  useEffect(() => {
    fetchMessages(currentChatGroupId, messageIndex);
  }, [messageIndex, fetchMessages]);

  const fetchMessages = useCallback(async (groupId, pageNumber) => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}api/chat-groups/${groupId}/messages`,
        {
          params: { messageIndex: pageNumber, limit: 10 },
          withCredentials: true,
        }
      );
      
      if (response.data.success) {
        const newMessages = response.data.data;
        setChatGroupData((prevData) => {
          // Prevent duplicate messages when fetching
          const uniqueMessages = newMessages.filter(
            (newMsg) => !prevData.some(
              (existingMsg) => existingMsg.chatMessage.messageId === newMsg.chatMessage.messageId
            )
          );
          return [...prevData, ...uniqueMessages];
        });
        setHasMoreMessage(newMessages.length > 0);
      } else {
        console.error(response.data.errorMessage);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  const handleGroupClick = useCallback(
    (chatGroupId, groupName, type, studentCode, userIdForPersonalChat) => {
      if (chatGroupId === currentChatGroupId) return;
      
      // Leave current group before joining new one
      if (connection && currentChatGroupId) {
        connection.invoke("LeaveChatGroup", currentChatGroupId.toString())
          .catch(err => console.error(`Error leaving chat group: ${err}`));
      }
      if (studentCode === undefined) {
        setCurrentStudentCode(null);
      } else{
        setCurrentStudentCode(studentCode);
      }
      setCurrentUserIdForPersonalChat(userIdForPersonalChat)
      setActiveGroupId(chatGroupId);
      setCurrentChatGroupName(groupName);
      setCurrentChatGroupType(type);
      setCurrentChatGroupId(chatGroupId);
      setChatGroupData([]);
      setMessageIndex(0);
      fetchMessages(chatGroupId, 0);
      if (connection) {
        connection
          .invoke("JoinChatGroup", chatGroupId.toString())
          .then(() => console.log(`Joined chat group: ${chatGroupId}`))
          .catch((err) => console.error(`Error joining chat group: ${err}`));
      }
    },
    [connection, fetchMessages, currentChatGroupId]
  );

  const sendMessage = async () => {
    if (connection && currentChatGroupId) {
      if (newMessage.trim() === ""){
        showToast("error", "Message cannot be empty.")
        return;
      }
      if (newMessage.length > 4000) {
        showToast("error", "Message cannot exceed 4000 characters.");
        return;
      }
      try {
        await connection.invoke(
          "SendMessage",
          id,
          currentChatGroupId.toString(),
          newMessage
        );
        setNewMessage("");
        const inputElement = document.querySelector("textarea");
      if (inputElement) {
        inputElement.style.height = "40px";
      }
      } catch (err) {
        showToast("error", "Send message failed.")
        console.error("Error sending message:", err);
      }
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <React.Fragment>
      <Container>
        {/* START Content */}
        <Row>
          <Col
            lg={3}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "80vh",
              maxHeight: "800px",
            }}
          >
            {/* START Left Nav  */}
            <div className="mb-3">
              <div className="small mb-2">Search</div>
              <InputGroup>
                <Input
                  placeholder="Search for..."
                  value={searchChatGroup}
                  onChange={handleSearchChatGroupChange}
                />
                <InputGroupAddon addonType="append">
                  <Button outline color="secondary">
                    <i className="fa fa-search"></i>
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </div>
            {/* END Left Nav  */}
            {/* START Left Nav  */}
            <div className="mb-2">
              <span className="small">Contacts</span>
            </div>
            <div
              id="scrollableChatGroup"
              style={{
                flex: "1",
                overflowY: "auto",
              }}
            >
              <InfiniteScroll
                dataLength={chatData.length}
                next={loadMoreChatGroupData}
                hasMore={hasMoreChatGroup}
                loader={<Spinner color="primary" />}
                scrollableTarget="scrollableChatGroup"
                endMessage={
                  <p className="text-center text-muted py-2 small">
                    No more chat groups
                  </p>
                }
              >
                <Nav pills vertical>
                  {chatData.map((group) => (
                    <NavItem key={group.chatGroup.chatGroupId}>
                      <NavLink
                        className={activeGroupId === group.chatGroup.chatGroupId || currentChatGroupId === group.chatGroup.chatGroupId? "active" : ""}
                        onClick={(e) => {
                          e.preventDefault();
                          handleGroupClick(
                            group.chatGroup.chatGroupId,
                            group.chatGroup.chatGroupName,
                            group.chatGroup.type,
                            group.student?.studentCode,
                            group.userId
                          );
                        }}
                        onMouseEnter={() => handleMouseEnter(group.chatGroup.chatGroupId)}
                        style={{ cursor: 'default' }}
                        >
                        <Media>
                          <Media left className="align-self-start mr-3">
                            <Avatar.Image
                              size="sm"
                              src={
                                group.chatGroup.chatGroupAvatar ||
                                randomAvatar()
                              }
                            />
                          </Media>
                          <Media body>
                            <div className="mt-0 d-flex">
                              {group.chatGroup.chatGroupName}
                            </div>
                            <span
                              className="small"
                              style={{
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                                flexShrink: 0,
                              }}
                            >
                              {group.latestMessage}
                            </span>
                            <div className="small mt-1">{getFormattedTime(group.sendDatetime)}</div>
                          </Media>
                        </Media>
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </InfiniteScroll>
            </div>
            {/* END Left Nav  */}
          </Col>
          <Col lg={9}>
            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                height: "80vh",
                maxHeight: "800px",
              }}
            >
              <CardHeader className="d-flex bb-0 bg-white">
                <h6 className="align-self-center mb-0">
                  {currentChatGroupName}
                </h6>
                <UncontrolledButtonDropdown className="align-self-center ml-auto">
                    {currentChatGroupType === "Group" && (   
                      <>               
                        <DropdownToggle
                          color="link"
                          size="sm"
                          className="text-decoration-none"
                        >
                          <i className="fa fa-gear"></i>
                          <i className="fa fa-angle-down ml-2"></i>
                        </DropdownToggle>
                        <DropdownMenu right>
                          {currentGroup !== null && (
                            <DropdownItem onClick={toggleAddMembersModal}>
                            <i className="fa fa-fw fa-user-plus mr-2"></i>
                            Add Members
                            </DropdownItem>
                          )}
                          <DropdownItem onClick={toggleViewMembersModal}>
                            <i className="fa fa-fw fa-users mr-2"></i>
                            View Members
                          </DropdownItem>
                        </DropdownMenu> 
                      </>
                    )}
                    {currentChatGroupType === "Personal" && ( 
                      <>
                        <DropdownToggle
                          color="link"
                          size="sm"
                          className="text-decoration-none"
                        >
                          <i className="fa fa-gear"></i>
                          <i className="fa fa-angle-down ml-2"></i>
                        </DropdownToggle>
                        <DropdownMenu right>
                          {currentGroup !== null && currentStudentCode !== null && (
                              <DropdownItem onClick={handleAddMembers}>
                                <i className="fa fa-fw fa-users mr-2"></i>
                                Invite to group {currentGroup.groupName}
                              </DropdownItem>
                            )}
                          <DropdownItem>
                            <Link to={`/Views/Profile/ViewProfile/${currentUserIdForPersonalChat}`}>
                              <i className="fa fa-fw fa-user-circle mr-2"></i>
                              View Profile
                            </Link>
                          </DropdownItem>
                        </DropdownMenu>   
                      </>                  
                    )}
                </UncontrolledButtonDropdown>
              </CardHeader>
              <CardBody
                id="scrollableMessageDiv"
                style={{
                  flexDirection: "column-reverse",
                  overflowY: "auto",
                  display: "flex",
                }}
                onScroll={handleMessageScroll}
              >
                <Modal
                  isOpen={isAddMembersModalOpen}
                  toggle={toggleAddMembersModal}
                >
                  <ModalHeader tag="h6">
                    <i className="fa fa-user-plus mr-2"></i> Add Members
                  </ModalHeader>
                  <ModalBody>
                    <AsyncTypeahead
                      id="add-members-typeahead"
                      isLoading={isLoading}
                      labelKey="studentCode"
                      minLength={3}
                      onSearch={handleSearch}
                      options={options}
                      placeholder="Search for users by student code..."
                      renderMenuItemChildren={(option) => (
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                          <img
                            src={option.avatar || "/path/to/default/avatar.png"}
                            style={{
                              height: "48px",
                              width: "48px",
                              marginRight: "10px",
                            }}
                          />
                          <div>
                            <div>{option.fullName} - {option.studentCode}</div>
                            <div>{option.email}</div>
                          </div>
                        </div>
                      )}
                      onChange={setSelectedUser}
                      selected={selectedUser}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={toggleAddMembersModal}>
                      Close
                    </Button>
                    <Button color="primary" onClick={handleAddMembers}>
                      Add Members
                    </Button>
                  </ModalFooter>
                </Modal>
                <Modal
                  isOpen={isViewMembersModalOpen}
                  toggle={toggleViewMembersModal}
                  size="lg"
                >
                  <ModalHeader tag="h6">
                    <i className="fa fa-users mr-2"></i> View Members
                  </ModalHeader>
                  <ModalBody>
                    <Table className="mb-0" responsive>
                      <thead>
                        <tr>
                          <th className="bt-0">No.</th>
                          <th className="bt-0">Full Name</th>
                          <th className="bt-0">Email</th>
                          <th className="bt-0">Is Owner</th>
                          <th className="bt-0">Is Mentor</th>
                          <th className="bt-0">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {membersInChatGroupData.map((item, index) => (
                          <tr key={index}>
                            <td className="align-middle">{index + 1}</td>
                            <td className="align-middle">{item.fullName}</td>
                            <td className="align-middle">{item.email}</td>
                            <td className="align-middle">
                              {item.isOwner ? (
                                <i className="fa fa-check text-success"></i>
                              ) : (
                                <i className="fa fa-times text-danger"></i>
                              )}
                            </td>
                            <td className="align-middle">
                              {item.isMentor ? (
                                <i className="fa fa-check text-success"></i>
                              ) : (
                                <i className="fa fa-times text-danger"></i>
                              )}
                            </td>
                            <td>
                              <UncontrolledButtonDropdown className="align-self-center ml-auto">
                                {item.userId.toString() !== id && (
                                  <>
                                    <DropdownToggle
                                      color="link"
                                      size="sm"
                                      className="text-decoration-none"
                                    >
                                      <i className="fa fa-gear"></i>
                                      <i className="fa fa-angle-down ml-2"></i>
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                          <DropdownItem>
                                            <Link to={`/Views/Profile/ViewProfile/${item.userId}`}>
                                              <i className="fa fa-fw fa-user-circle mr-2"></i>
                                              View Profile
                                            </Link>
                                          </DropdownItem>
                                          <DropdownItem onClick={() => toggleModalContact(item.userId)}>
                                          <i className="fa fa-fw fa-users mr-2"></i>
                                              Contact
                                          </DropdownItem>
                                        
                                    </DropdownMenu> 
                                  </>
                                )}
                              </UncontrolledButtonDropdown>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={toggleViewMembersModal}>
                      Close
                    </Button>
                  </ModalFooter>
                </Modal>
                <Modal
                  isOpen={isConfirmKickMemberModalOpen}
                  toggle={toggleConfirmKickMemberModal}
                  size="sm"
                >
                  <ModalHeader tag="h6">
                    <i className="fa fa-minus mr-2"></i> Kick Member
                  </ModalHeader>
                  <ModalBody>
                    Are you sure you want to remove this member from the chat
                    group?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={handleKickMember}>
                      <i className="fa fa-check mr-2"></i>
                      Sure
                    </Button>
                    <Button
                      color="secondary"
                      onClick={toggleConfirmKickMemberModal}
                    >
                      <i className="fa fa-close mr-2"></i>
                      No
                    </Button>
                  </ModalFooter>
                </Modal>
                <Modal
                  isOpen={isConfirmDeleteGroupChatModalOpen}
                  toggle={toggleConfirmDeleteGroupChatModal}
                  size="sm"
                >
                  <ModalHeader tag="h6">
                    <i className="fa fa-trash mr-2"></i> Delete Group Chat
                  </ModalHeader>
                  <ModalBody>
                    Are you sure you want to delete this group chat? This action
                    cannot be undone.
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={handleDeleteGroupChat}>
                      <i className="fa fa-check mr-2"></i>
                      Sure
                    </Button>
                    <Button
                      color="secondary"
                      onClick={toggleConfirmDeleteGroupChatModal}
                    >
                      <i className="fa fa-close mr-2"></i>
                      No
                    </Button>
                  </ModalFooter>
                </Modal>
                <InfiniteScroll
                  dataLength={chatGroupData.length}
                  next={loadMoreMessageData}
                  inverse={true}
                  hasMore={hasMoreMessage}
                  style={{ display: "flex", flexDirection: "column-reverse" }}
                  loader={<Spinner color="primary" />}
                  scrollableTarget="scrollableMessageDiv"
                  endMessage={
                    <p className="text-center text-muted py-2 small">
                      No more messages
                    </p>
                  }
                  >
                  {chatGroupData.map((message) => {
                    return message.senderName === "You" ? (
                      <Media 
                        className="mb-2" 
                        key={message.chatMessage.messageId} 
                        style={{ display: "flex", alignItems: "flex-end", width: "100%" }}
                        onMouseEnter={() => handleHoverMessage(message.chatMessage.messageId, true)}
                        onMouseLeave={() => handleHoverMessage(message.chatMessage.messageId, false)}
                      >
                        <Media
                          body
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            flex: 1,
                            overflow: "hidden",
                          }}
                        >
                          <Card
                            body
                            className="mb-2 text-dark"
                            style={{
                              display: "inline-block",
                              maxWidth: "100%",
                              wordWrap: "break-word",
                              textAlign: "right",
                              overflowWrap: "break-word",
                              whiteSpace: "pre-wrap",
                              padding: "10px"
                            }}
                          >
                            <p
                              className="mb-0"
                              style={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                                fontStyle: message.chatMessage.isDeleted ? "italic" : "normal", //Chu In nghieng
                                opacity: message.chatMessage.isDeleted ? 0.6 : 1, //Lam mo chu
                              }}
                            >
                              {message.chatMessage.isDeleted 
                                ? "This message has been deleted by you" 
                                : message.chatMessage.messageContent}
                            </p>
                          </Card>
                          <div className="mb-2 text-right">                            
                            {hoverMessageState[message.chatMessage.messageId] && (
                              <span
                                className="mr-2"
                                style={{
                                  cursor: "pointer",
                                  position: "relative",
                                }}
                                onClick={() => handleShowMessageOptions(message.chatMessage.messageId)}
                              >
                                <i className="fa fa-ellipsis-h"></i>
                                {messageOptions[message.chatMessage.messageId] && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      right: "20px",
                                      top: "0px",
                                    }}
                                  >
                                  <Button
                                    color="secondary"
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      cursor: "pointer",
                                      borderRadius: "0",
                                      fontSize: "12px",
                                      padding: "5px 10px",
                                    }}
                                    onClick={() => toggleConfirmDeleteMessageModal(message.chatMessage.messageId)}
                                  >
                                    Delete
                                  </Button>
                                  </div>
                                )}
                              </span>
                            )}
                            <span className="small">
                              {getFormattedTime(message.chatMessage.sendDatetime)}
                            </span>
                          </div>
                        </Media>
                      </Media>
                    ) : (
                      <Media className="mb-2" key={message.chatMessage.messageId} style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                        <Media left className="mr-3" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                          <Avatar.Image
                            size="md"
                            src={message.avatar || randomAvatar()}
                            className="mr-2"
                          />
                        </Media>
                        <Media
                          body
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            flex: 1,
                            overflow: "hidden",
                          }}
                        >
                          <Card
                            body
                            className="mb-2 bg-gray-300 b-0 text-dark"
                            style={{
                              display: "inline-block",
                              maxWidth: "100%",
                              wordWrap: "break-word",
                              textAlign: "left",
                              overflowWrap: "break-word",
                              whiteSpace: "pre-wrap",
                              padding: "10px"
                            }}
                          >
                            <p
                              className="mb-0"
                              style={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                                fontStyle: message.chatMessage.isDeleted ? "italic" : "normal", //Chu In nghieng
                                opacity: message.chatMessage.isDeleted ? 0.6 : 1, //Lam mo chu
                              }}
                            >
                              {message.chatMessage.isDeleted 
                                ? "This message has been deleted by the owner" 
                                : message.chatMessage.messageContent}
                            </p>
                          </Card>
                          <div className="mb-2">
                            <span className="text-inverse mr-2">{message.senderName}</span>
                            <span className="small">
                              {getFormattedTime(message.chatMessage.sendDatetime)}
                            </span>
                          </div>
                        </Media>
                      </Media>
                    );
                  })}
                </InfiniteScroll>
                <div ref={messagesEndRef} />
              </CardBody>
              <CardFooter className="chat-card-footer">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <Button 
                      color="secondary" outlin
                      style={{cursor: "not-allowed"}}
                    >
                      <i className="fa fa-paperclip"></i>
                    </Button>
                  </InputGroupAddon>
                  <Input
                    type="textarea"
                    placeholder="Your message..."
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    onInput={(e) => {
                      e.target.style.height = "40px";
                      e.target.style.height = Math.min(e.target.scrollHeight, 5 * 24) + "px";
                    }}
                    style={{
                      resize: "none",
                      overflowY: "auto",
                      lineHeight: "24px",
                      maxHeight: "120px",
                      height: "40px",
                    }}
                  />
                  <InputGroupAddon addonType="append">
                    <Button color="primary" onClick={sendMessage}>
                      <i className="fa fa-send"></i>
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        {/* END Content */}
      </Container>
      <ContactModal isOpen={modalContactOpen} toggle={toggleModalContact} contactedUserId = {selectedContactedUserId} closeParentModal = {closeBothModals}/>
      <ConfirmDeleteMessageModal isOpen={isConfirmDeleteMessageModalOpen} toggle={toggleConfirmDeleteMessageModal} messageId={selectedMessageId}/>
    </React.Fragment>
  );
};

export default Clients;
