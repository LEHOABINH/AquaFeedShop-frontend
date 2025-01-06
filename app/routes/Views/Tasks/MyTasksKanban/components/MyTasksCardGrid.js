import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { Link, useHistory, useParams  } from "react-router-dom";
import axios from 'axios';
import config from '../../../../../../config';

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
} from "../../../../../components";

import { randomArray, randomAvatar } from "../../../../../utilities";

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

const MyTasksCardGrid = ({ taskId, taskName, description, startDate, endDate, status, progress, taskAssigns }) => {
  const [avatars, setAvatars] = useState({});

  useEffect(() => {
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

    fetchAvatars();
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
      </CardBody>
      <CardFooter className="d-flex">
        <span className="align-self-center">Deadline: {new Date(endDate).toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
};

MyTasksCardGrid.propTypes = {
  taskId: PropTypes.number.isRequired,
  taskName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  taskAssigns: PropTypes.arrayOf(PropTypes.shape({
    studentId: PropTypes.number.isRequired,
    taskAssignId: PropTypes.number.isRequired,
  })).isRequired,
};

export { MyTasksCardGrid };