import React from 'react';
import PropTypes from "prop-types";
import { useHistory } from 'react-router-dom';
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "../../../../components";
import { showToast } from "./../../Utils/Toast";

const GroupContent = ({ groups }) => {
  const history = useHistory();

  const handleDetailsClick = (groupId) => {
    history.push({
      pathname: '/views/students/groupsDetails',
      state: { groupId },
    });
  };

  const styles = {
    statusCell: {
      cursor: "pointer",
      transition: "color 0.3s, transform 0.3s",
    },
    statusCellHover: {
      color: "blue",
      transform: "scale(1.1)",
    },
  };

  const handleStatusClick = (status) => {
    if (status === "Initialized") {
      showToast("info", "The group has just been started and does not have a mentor yet.");
    }
    if (status === "Eligible") {
      showToast("info", "The group has enough members and has a mentor.");
    }
    if (status === "Approved") {
      showToast("info", "The group has a topic and started the project.");
    }
    if (status === "Overdue") {
      showToast("info", "The group has expired and is waiting to be regrouped.");
    }
  };

  return (
    <React.Fragment>
      {groups.map((item, index) => (
        <tr key={index}>
          {/* <td className="align-middle">{item.groupId}</td> */}
          <td className="align-middle">{item.groupName}</td>
          <td className="align-middle">{item.subjectName}</td>
          <td className="align-middle">{item.hasMentor ? (
            <span style={{ color: "green", fontSize: "1.2em" }}>✔️</span>
          ) : (
            <span style={{ color: "red", fontSize: "1.2em" }}>❌</span>
          )}</td>
          <td
            className="align-middle"
            style={styles.statusCell}
            onClick={() => handleStatusClick(item.status)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = styles.statusCellHover.color;
              e.currentTarget.style.transform = styles.statusCellHover.transform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "";
              e.currentTarget.style.transform = "";
            }}
          >
            {item.status}
          </td>
          <td className="align-middle text-right">
            <Button
              color="primary"
              outline
              className="align-self-center"
              onClick={() => handleDetailsClick(item.groupId)}
            >
              Details
            </Button>
          </td>
        </tr>
      ))}
    </React.Fragment>
  );
};

GroupContent.propTypes = {
  groups: PropTypes.array.isRequired,
};

export { GroupContent };
