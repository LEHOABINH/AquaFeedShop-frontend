import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Badge,
  CardFooter,
  Progress,
  Avatar,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "./../../../components";

const statusMap = {
  "Status 1": <Badge pill color="success">Active</Badge>,
  "Status 2": <Badge pill color="danger">Suspended</Badge>,
  "Status 3": <Badge pill color="warning">Waiting</Badge>,
  "Status 4": <Badge pill color="secondary">Paused</Badge>,
};

const ProjectsCardGrid = ({ project }) => {
  const tasksCompleted = Math.floor(Math.random() * 100); // Tùy chỉnh logic này nếu cần

  return (
    <React.Fragment>
      {/* START Card */}
      <Card>
        <CardBody>
          {statusMap[project.status]} {/* Hiển thị badge theo trạng thái */}
          <div className="mb-2">
            <a href="#" className="mr-2">
              <i className="fa fa-fw fa-star-o"></i>
            </a>
            <Link to={`/projects/${project.projectId}`} className="text-decoration-none">
              {project.topicName}
            </Link>
          </div>
          <div className="mb-3">
            Topic Code: {project.topeCode} <br />
            {new Date(project.startDate).toLocaleDateString()}
          </div>
          <div className="mb-3">
            Description:{project.description}
          </div>
          <div>
            Subject: {project.subjectName}
          </div>
        </CardBody>
        <CardFooter className="d-flex">
          <span className="align-self-center">{new Date(project.endDate).toLocaleDateString()}</span>
          <UncontrolledButtonDropdown className="align-self-center ml-auto">
            <DropdownToggle color="link" size="sm" className="pr-0">
              <i className="fa fa-gear" />
              <i className="fa fa-angle-down ml-2" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <i className="fa fa-fw fa-folder-open mr-2"></i>
                View
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-fw fa-ticket mr-2"></i>
                Add Task
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-fw fa-paperclip mr-2"></i>
                Add Files
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                <i className="fa fa-fw fa-trash mr-2"></i>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </CardFooter>
      </Card>
      {/* END Card */}
    </React.Fragment>
  );
};

export { ProjectsCardGrid };
