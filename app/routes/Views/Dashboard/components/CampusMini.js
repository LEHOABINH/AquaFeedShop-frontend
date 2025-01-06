import React from "react";
import PropTypes from "prop-types";
import { Badge } from "../../../../components";

const CampusMini = (props) => (
  <React.Fragment>
      <div className="timeline">
          {props.showPillDate && (
              <div className="timeline-date">
                  <Badge pill>{props.pillDate}</Badge>
              </div>
          )}
          <div className="timeline-item">
              <div className="timeline-icon">
                  <i className={`fa fa-fw fa-${props.icon} ${props.iconClassName}`}></i>
              </div>
              <div className="timeline-item-head clearfix mb-0 pl-3">
                  <div className="mb-2">
                      <span className={`badge badge-${props.badgeColor}`}>
                          {props.badgeTitle}
                      </span>
                  </div>
                  {/* Hiển thị thông tin truyền qua prop content */}
                  <p className="text-inverse mr-2">
                    <strong>User:</strong> {props.userCount}
                  </p>
                  <p className="text-inverse mr-2">
                    <strong>Student:</strong> {props.studentCount}
                  </p>
                  <p className="text-inverse mr-2">
                    <strong>Mentor:</strong> {props.mentorCount}
                  </p>
                  {/* <p>
                    <strong>{props.studentCount}</strong>
                    <span className="text-inverse mb-1"> - {props.mentorCount}</span>
                  </p> */}
              </div>
          </div>
      </div>
  </React.Fragment>
);

CampusMini.propTypes = {
  userCount: PropTypes.number.isRequired, // Prop userCount để hiển thị số lượng user
  studentCount: PropTypes.number.isRequired, // Prop studentCount để hiển thị số lượng sinh viên
  mentorCount: PropTypes.number.isRequired, // Prop mentorCount để hiển thị số lượng mentor
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  badgeColor: PropTypes.string,
  badgeTitle: PropTypes.string,
  showPillDate: PropTypes.bool,
  pillDate: PropTypes.string,
};

CampusMini.defaultProps = {
  userCount: 0,
  studentCount: 0,
  mentorCount: 0,
  icon: "university",
  iconClassName: "text-success",
  badgeColor: "success",
  badgeTitle: "Student Info",
  showPillDate: false,
  pillDate: "Waiting",
};

export { CampusMini };
