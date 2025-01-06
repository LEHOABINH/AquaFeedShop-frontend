import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { Link, useHistory, useParams  } from "react-router-dom";
import axios from 'axios';
import config from './../../../../../../config';

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
} from "./../../../../../components";

import { randomArray, randomAvatar } from "./../../../../../utilities";

const avatarStatus = ["secondary", "warning", "danger", "success"];

// Hàm fetch thông tin student từ API dùng axios
const fetchStudentInfo = async (studentId) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}api/students/${studentId}`, {
      withCredentials: true,
    });
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error(`Error fetching student ${studentId}:`, error);
    return null;
  }
};

const TasksCardGrid = ({ taskId, taskName, description, startDate, endDate, status, progress, taskAssigns, onEdit, onDelete }) => {
  const [avatars, setAvatars] = useState({});
  const [groupMemberRole, setGroupMemberRole] = useState(null);
  // Fetch project ID based on the user
  const fetchGroupMemberRole = async () => {
      try {
          const responseGroupMemberRole = await axios.get(`${config.apiBaseUrl}api/groupMember/GetGroupMemberByUserID`, {
              withCredentials: true,
          });

          if (responseGroupMemberRole.data.success) {
              setGroupMemberRole(responseGroupMemberRole.data.data.role);
          } else {
              console.error('Failed to fetch project ID');
          }
      } catch (error) {
          console.error('Error fetching project ID:', error);
      }
  };

  const fetchAvatars = async () => {
    const avatarPromises = taskAssigns.map(async (assign) => {
      const studentInfo = await fetchStudentInfo(assign.studentId);
      if (!studentInfo) {
          console.error(`No student info found for studentId: ${assign.studentId}`);
      }
      return { studentId: assign.studentId, avatar: studentInfo?.user?.avatar || randomArray(avatarStatus) };
    });

    const avatarResults = await Promise.all(avatarPromises);
    const avatarsMap = avatarResults.reduce((acc, curr) => {
      acc[curr.studentId] = curr.avatar;
      return acc;
    }, {});

    setAvatars(avatarsMap);
  };

  useEffect(() => {
    fetchAvatars();
    fetchGroupMemberRole();
  }, [taskAssigns]);

  const history = useHistory();
  const handleTaskClick = () => {
    history.push(`/apps/task-details/${taskId}`);
  };
  
  return (
    <Card>
      <CardBody>
        <Media className="mb-2">
          <Media body>
            <span className="mr-2">#{taskId}</span>
            <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleTaskClick();
            }}
            className="text-decoration-none"
          >
          {taskName}
          </a>
          </Media>
        </Media>
        <p className="mb-0">
          <span className="mr-2">{description}</span>
        </p>
        <p className="mb-2">Start Date: {new Date(startDate).toLocaleDateString()}</p>
        <div>
          {taskAssigns.map(assign => (
            <Avatar.Image
              key={assign.studentId}
              size="md"
              src={avatars[assign.studentId]}
              className="mr-3"
            />
          ))}
        </div>
        <div className="progress mt-2">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      </CardBody>
      <CardFooter className="d-flex">
        <span className="align-self-center">Deadline: {new Date(endDate).toLocaleDateString()}</span>
        {groupMemberRole === "Leader" && (
          <UncontrolledButtonDropdown className="align-self-center ml-auto">
            <DropdownToggle color="link" size="sm">
              <i className="fa fa-gear" />
              <i className="fa fa-angle-down ml-2" />
            </DropdownToggle>
            <DropdownMenu right>
              {status === "Not_Started" && (
                <>
                  <DropdownItem onClick={onEdit}>
                    <i className="fa fa-fw fa-wrench mr-2"></i> Edit
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => onDelete(taskId)} className="text-danger">
                    <i className="fa fa-fw fa-trash mr-2"></i> Delete
                  </DropdownItem>
                </>
              )}

              {status === "In_Progress" && (
                <>
                  <DropdownItem onClick={onEdit}>
                    <i className="fa fa-fw fa-refresh mr-2"></i> Re-Assign
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => onDelete(taskId)} className="text-danger">
                    <i className="fa fa-fw fa-trash mr-2"></i> Delete
                  </DropdownItem>
                </>
              )}

              {status === "Completed" && (
                <>
                  <DropdownItem onClick={() => onDelete(taskId)} className="text-danger">
                    <i className="fa fa-fw fa-trash mr-2"></i> Delete
                  </DropdownItem>
                </>
              )}

              {status === "Overdue" && (
                <>
                  <DropdownItem onClick={onEdit}>
                    <i className="fa fa-fw fa-refresh mr-2"></i> Re-Assign
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => onDelete(taskId)} className="text-danger">
                    <i className="fa fa-fw fa-trash mr-2"></i> Delete
                  </DropdownItem>
                </>
              )}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        )}
      </CardFooter>
    </Card>
  );
};

TasksCardGrid.propTypes = {
  taskId: PropTypes.number.isRequired,
  taskName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  taskAssigns: PropTypes.arrayOf(PropTypes.shape({
    studentId: PropTypes.number.isRequired,
    taskAssignId: PropTypes.number.isRequired,
  })).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export { TasksCardGrid };