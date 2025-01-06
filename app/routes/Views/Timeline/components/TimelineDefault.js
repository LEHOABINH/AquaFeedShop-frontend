import React from "react";
import { faker } from "@faker-js/faker";
import PropTypes from "prop-types";
import { randomArray } from "../../../../utilities";
import { Button } from "reactstrap";
import useAuth from "../../../../../hooks/useAuth";

const hour = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const min = ["00", "15", "20", "25", "30", "35", "40", "45", "50"];
const amPm = ["am", "pm"];

const TimelineDefault = (props) => {
  const { role } = useAuth();

  return (
    <React.Fragment>
      <div className="timeline timeline-datetime">
        {props.showPillDate && (
          <div className="timeline-date">
            <span className="badge badge-pill badge-secondary">
              {props.pillDate}
            </span>
          </div>
        )}
        <div className="timeline-item pr-3">
          <div className="timeline-icon">
            <i className={`fa fa-circle-o text-${props.smallIconColor}`}></i>
          </div>
          <div className="timeline-item-inner pb-0">
            <div className="timeline-item-head pb-0">
              <div className="pull-left mr-2">
                <span className="fa-stack fa-lg">
                  <i className={`fa fa-circle fa-stack-2x text-${props.iconCircleColor}`}></i>
                  <i className={`fa fa-stack-1x text-white fa-${props.iconCircle}`}></i>
                </span>
              </div>
              <div className="user-detail">
                <h6 className="mb-0">{props.title}</h6>
              </div>
            </div>
            <div className="timeline-item-content">
              <p>{props.description || "No description provided."}</p>
            </div>
            {role === 'Manager' && (
              <div className="timeline-item-actions">
                <Button
                  color="primary"
                  onClick={() => props.onUpdate(props.timelineId)}
                >
                  Update
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

TimelineDefault.propTypes = {
  showPillDate: PropTypes.bool,
  pillDate: PropTypes.string,
  smallIconColor: PropTypes.string,
  iconCircleColor: PropTypes.string,
  iconCircle: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  timelineId: PropTypes.number.isRequired,
};

TimelineDefault.defaultProps = {
  showPillDate: false,
  pillDate: "Waiting",
  smallIconColor: "secondary",
  iconCircleColor: "secondary",
  iconCircle: "question",
  title: "Default Title",
};

export { TimelineDefault };
