import React from "react";
import { faker } from "@faker-js/faker";
import PropTypes from "prop-types";

import { Badge } from "./../../../../components";

const TimelineMini = (props) => (
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
                  <p className="text-inverse mr-2">                    
                    <strong>Group:</strong> {props.groupName}
                  </p>
                  {props.url ? (
                    <a
                        href={props.url}
                        className="text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <strong>
                            <i className="fa fa-link mr-2"></i>
                            {props.meetingTitle}
                        </strong>
                    </a>
                  ) : (
                    <strong>{props.meetingTitle}</strong>
                  )}
                  <span className="text-inverse mb-1"> - {props.content}</span>
                  <p>{props.meetingDate} - {props.duration} minutes</p>
              </div>
          </div>
      </div>
  </React.Fragment>
);

TimelineMini.propTypes = {
  groupName: PropTypes.string,
  duration: PropTypes.string,
  content: PropTypes.string,
  type: PropTypes.string,
  url: PropTypes.string,
  showPillDate: PropTypes.bool,
  pillDate: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  badgeColor: PropTypes.string,
  badgeTitle: PropTypes.string,
  meetingTitle: PropTypes.string,
  meetingDate: PropTypes.string,
};

TimelineMini.defaultProps = {
  groupName: "Group A",
  duration: "Duration A",
  content: "Content A",
  type: "Online",
  url: "Url",
  showPillDate: false,
  pillDate: "Waiting",
  icon: "question-circle",
  iconClassName: "text-secondary",
  badgeColor: "secondary",
  badgeTitle: "Waiting",
  meetingTitle: "No title",
  meetingDate: "No date",
};

export { TimelineMini };
