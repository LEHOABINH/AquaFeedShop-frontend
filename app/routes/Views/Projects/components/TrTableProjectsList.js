import React from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  Progress,
  Avatar,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "./../../../../components";

const TrTableProjectsList = ({ project }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'In_Progress':
        return 'badge badge-info'; // Màu Xanh Lá
      case 'Completed':
        return 'badge badge-danger'; // Màu Đỏ
      default:
        return 'badge badge-primary'; // Mặc định Màu Xanh Dương, nếu không khớp với các trạng thái trên
    }
  };

  return (
    <tr>
      <td className="align-middle"><span className={getStatusBadgeClass(project.status)}>{project.status}</span></td>

      <td className="align-middle">
        <div>
          <Link className="text-decoration-none">
            {project.topicName}
          </Link>
        </div>
        <span>
          Topic Code: {project.topicCode} <br />
          Start Date: {new Date(project.startDate).toLocaleDateString()}
        </span>
      </td>
      <td className="align-middle">
        <div>
          {project.description}        
        </div>
      </td>
      <td className="align-middle">
        {project.subjectName}
      </td>
    </tr>
  );
};

export { TrTableProjectsList };
