import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { Link, useHistory, useParams  } from "react-router-dom";
import axios from 'axios';
import config from './../../../../../../config';
import { showToast } from "./../../../Utils/Toast";

import {
  Avatar,
  Nav,
  Media,
  NavItem,
  NavLink,
} from "../../../../../components";
import { randomAvatar } from "../../../../../utilities";

const TrTableMyTasksList = ({ taskId, taskName, description, startDate, endDate, status, progress, taskAssigns }) => {
  const [avatars, setAvatars] = useState({});
  const [assignedStudents, setAssignedStudents] = useState([]);

  const fetchAssignedStudent = async () => {
    const assignedStudentPromises = taskAssigns.map(async (assign) => {
      const studentResponse = await axios.get(
        `${config.apiBaseUrl}api/students/${assign.studentId}`,
        { withCredentials: true }
      );
      if (studentResponse.data.success) {
        return studentResponse.data.data;
      }
      return null;
    });
    const students = await Promise.all(assignedStudentPromises);
    setAssignedStudents(students.filter(Boolean));
  };

  useEffect(() => {
    fetchAssignedStudent();
  }, [taskAssigns]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Not_Started':
        return 'badge badge-secondary'; // Màu Xám
      case 'In_Progress':
        return 'badge badge-info'; // Màu Xanh Lá
      case 'Overdue':
        return 'badge badge-warning '; // Màu Vàng Cam
      case 'Completed':
        return 'badge badge-danger'; // Màu Đỏ
      default:
        return 'badge badge-primary'; // Mặc định Màu Xanh Dương, nếu không khớp với các trạng thái trên
    }
  };

  const history = useHistory();
  const handleTaskClick = () => {
    history.push(`/apps/task-details/${taskId}`);
  };


  return (
    <tr>
      <td className="align-middle"><span className={getStatusBadgeClass(status)}>{status}</span></td>
      <td className="align-middle">
        <div>
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
        </div>
        <p className="mb-0">
          <span className="mr-2">{description}</span>
        </p>
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
      </td>
      <td className="align-middle">
        {new Date(startDate).toLocaleDateString()}
      </td>
      <td className="align-middle">
        {new Date(endDate).toLocaleDateString()}
      </td>
      <td className="align-middle">
        <Nav pills vertical>
          {assignedStudents.map((student) => (
            <NavItem key={student.studentId}>
              <NavLink href="#" className="d-flex">
                <Media>
                  <Media left middle className="mr-3 align-self-center">
                    <Avatar.Image size="md" src={student.user.avatar || randomAvatar()} />
                  </Media>
                  <Media body>
                    <div className="mt-0">{student.user.fullName}</div>
                  </Media>
                </Media>
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </td>
    </tr>
  );
};

TrTableMyTasksList.propTypes = {
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
};

export { TrTableMyTasksList };
