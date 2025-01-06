import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import config from '../../../../config';
import axios from 'axios';
import { showToast } from "../Utils/Toast";
import useAuth from "../../../../hooks/useAuth";

import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  Table,
  Card,
  CardBody,
  Media,
  Badge,
  Avatar,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "../../../components";
import { randomAvatar } from "../../../utilities";
import { HeaderMain } from "../../components/HeaderMain";
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import { TrTableTasksReAssign } from "./components/TrTableTasksReAssign";

const ProjectProgressStudent = () => {
  const [ projectId, setProjectId] = useState(null);
  const { id } = useAuth();
  const [projectProgress, setProjectProgress] = useState([]);
  const [project, setProject] = useState(null);
  const [tasksReAssign, setTasksReAssign] = useState([]);

  const fetchProjectId = async () => {
    try {
        const projectIdResponse = await axios.get(
          `${config.apiBaseUrl}api/projects/getProjectId/${id}`,
          { withCredentials: true }
        );      
        if (projectIdResponse.data.success) {
            setProjectId(projectIdResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  };

  const fetchProjectProgress = async () => {
    try {
      const projectProgressResponse = await axios.get(
        `${config.apiBaseUrl}api/project_progress/byProject/${projectId}`,
        { withCredentials: true }
      );      
      if (projectProgressResponse.data.success) {
        setProjectProgress(projectProgressResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const taskResponse = await axios.get(
        `${config.apiBaseUrl}api/projects/${projectId}`,
        { withCredentials: true }
      );
      if (taskResponse.data.success) {
        setProject(taskResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTasksReAssign = async () => {
    try {
        const tasksReAssignResponse = await axios.get(
          `${config.apiBaseUrl}api/task/byProject/overdueIsDeleted/${projectId}`,
          { withCredentials: true }
        );      
        if (tasksReAssignResponse.data.success) {
          setTasksReAssign(tasksReAssignResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  };

  useEffect(() => {
    fetchProjectId();
  }, [id]);

  useEffect(() => {
    if (projectId) {
        fetchData();
        fetchProjectProgress();
        fetchTasksReAssign();
    }
  }, [projectId]);

  if (!project) {
    return <div>Your project is not initialized yet.</div>;
  }

  return (
    <React.Fragment>
      <Container>
        <HeaderMain title="Project Progress" className="mb-5 mt-4" />
        <Row>
          <Col lg={3}>
            <div className="mb-5">
              <div className="small mb-3">Project Details</div>
              <Table size="sm">
                <tbody>
                  <tr>
                    <td className="align-middle">Topic Code</td>
                    <td className="text-right">
                      <span className="text-decoration-none">
                        {project.topicCode}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Topic Name</td>
                    <td className="text-right">{project.topicName}</td>
                  </tr>
                  <tr>
                    <td className="align-middle">Description</td>
                    <td className="text-right">{project.description}</td>
                  </tr>
                  <tr>
                    <td className="align-middle">Start Date</td>
                    <td className="text-right">
                      {new Date(project.startDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">End Date</td>
                    <td className="text-right">
                      {new Date(project.endDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Status</td>
                    <td className="text-right">
                      <Badge color={
                        project.status === 'Completed' ? 'danger' :
                        project.status === 'In_Progress' ? 'success' :
                        'warning'
                      }>
                        {project.status}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Progress</td>
                    <td className="text-right">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${project.progressPercentage}%` }}
                          aria-valuenow={project.progressPercentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {project.progressPercentage}%
                        </div>
                      </div>
                    </td>
                  </tr> 
                </tbody>
              </Table>
            </div>
          </Col>

          <Col lg={9}>
            <ProjectsSmHeader
              subTitle="Projects List"
              subTitleLink="/apps/projects/list"
              title="Project Progress"
            />
            <Card className="mb-3">
                <div className="table-responsive-xl">
                <Table className="mb-0" hover>
                    <thead>
                    <tr>
                        <th className="align-middle text-left bt-0" style={{ paddingLeft: '30px' }}>Member Name & Email</th>
                        <th className="align-middle text-center bt-0">Tasks Not Started</th>
                        <th className="align-middle text-center bt-0">Tasks In Progress</th>
                        <th className="align-middle text-center bt-0">Tasks Completed</th>
                        <th className="align-middle text-center bt-0">Tasks Overdue</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projectProgress.map((detail) => (
                        <tr key={detail.email}>
                        <td className="align-middle">
                            <Nav pills vertical>
                                <NavItem key={detail.email}>
                                <NavLink href="#" className="d-flex">
                                    <Media>
                                    <Media left middle className="mr-3 align-self-center">
                                        <Avatar.Image size="md" src={detail.avatar || randomAvatar()} />
                                    </Media>
                                    <Media body>
                                        <div className="mt-0">{detail.fullName}</div>
                                        <div className="text-muted small">{detail.email}</div>
                                    </Media>
                                    </Media>
                                </NavLink>
                                </NavItem>
                            </Nav>
                        </td>
                        <td className="text-center align-middle">
                          <span className="badge badge-secondary">
                            {detail.numberOfTaskNotStarted}
                          </span>
                        </td>
                        <td className="text-center align-middle">
                          <span className="badge badge-success">
                            {detail.numberOfTaskInProgress}
                          </span>
                        </td>
                        <td className="text-center align-middle">
                          <span className="badge badge-danger">
                            {detail.numberOfTaskCompleted}
                          </span>
                        </td>
                        <td className="text-center align-middle">
                          <span className="badge badge-warning">
                            {detail.numberOfTaskOverdue}
                          </span>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                  </Table>
                </div>
              </Card>

              {tasksReAssign && tasksReAssign.length > 0 && (
              <>
                <h5>Overdue Tasks have been Re-Assigned or Delete</h5>
                <Card className="mb-3">
                  <div className="table-responsive-xl">
                      <Table className="mb-0" hover>
                        <thead>
                            <tr>
                                <th className="align-middle bt-0">Status</th>
                                <th className="align-middle bt-0">Title & Description</th>
                                <th className="align-middle bt-0">StartDate</th>
                                <th className="align-middle bt-0">EndDate</th>
                                <th className="align-middle bt-0">People</th>
                            </tr>
                        </thead>
                        <tbody>
                          {tasksReAssign.map((task) => (
                            <TrTableTasksReAssign 
                              key={task.taskId}
                              taskId={task.taskId}
                              taskName={task.taskName}
                              description={task.description}  
                              startDate={task.startDate}
                              endDate={task.endDate}
                              status={task.status}
                              progress={task.progressPercentage}
                              taskAssigns={task.taskAssigns}
                            />
                          ))}
                        </tbody>
                      </Table>
                  </div>
                </Card>
              </>
              )}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default ProjectProgressStudent;