import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import config from './../../../../config';
import axios from 'axios';
import { showToast } from "./../Utils/Toast";
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "./../../../components";
import { randomAvatar } from "./../../../utilities";
import { HeaderMain } from "../../components/HeaderMain";
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";

const TasksDetails = () => {
  const { taskId } = useParams();
  const { id } = useAuth();
  const [checkingTask, setCheckingTask] = useState(false);
  const [studentIdForUserId, setStudentIdForUserId] = useState(null);
  const [task, setTask] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskDetailId, setSelectedTaskDetailId] = useState(null);
  const [isCompleteDialog, setIsCompleteDialog] = useState(null); // null: chưa xác định, true: Mark as Complete, false: Mark as Incomplete

  const checkingTaskOfUser = async () => {
    try {
      const checkingResponse = await axios.get(
        `${config.apiBaseUrl}api/task/checkingtask?taskId=${taskId}`,
        { withCredentials: true }
      );      
      if (checkingResponse.data.success) {
        setCheckingTask(checkingResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchStudentIdForUserId = async () => {
    try {
      // Fetch task information
      const studentIdResponse = await axios.get(
        `${config.apiBaseUrl}api/students/byuserid?userId=${id}`,
        { withCredentials: true }
      );      
      if (studentIdResponse.data.success) {
        setStudentIdForUserId(studentIdResponse.data.data.studentId);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch task information
      const taskResponse = await axios.get(
        `${config.apiBaseUrl}api/task/${taskId}`,
        { withCredentials: true }
      );
      if (taskResponse.data.success) {
        setTask(taskResponse.data.data);
        // Fetch information for each assigned student
        const assignedStudentPromises = taskResponse.data.data.taskAssigns.map(async (assign) => {
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
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchStudentIdForUserId();
    }
  }, [id]);

  useEffect(() => {
    if (taskId) {      
      checkingTaskOfUser();
    }
  }, [taskId]);

  useEffect(() => {
    if (checkingTask === true) {      
      fetchData();
    }
  }, [taskId, checkingTask]);

  if (checkingTask === false) {
    return <div>You do not have permission to access this content</div>;
  }
  if (!task) {
    return <div>Loading...</div>;
  }

  const calculateTotalProgress = () => {
    if (task.taskDetails.length === 0) return 0;
    const totalProgress = task.taskProgresses.reduce((sum, detail) => sum + detail.progressPercentage, 0);
    return Math.round(totalProgress);
  };

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  const handleMarkComplete = async () => {
    try {
      // Thực hiện API DELETE
      const updateResponse = await axios.put(
        `${config.apiBaseUrl}api/task-detail/updateStatus`,
        {
            taskDetailId: selectedTaskDetailId,
            isCompleted: true
        },
        { withCredentials: true }
      );
      if (updateResponse.data.success) {
        showToast('success', `Task Detail has been Completed`);
        await fetchData();
        toggleDialog();
      }
    } catch (error) {
      showToast('error', `Error Mark as Complete`);
      console.error('Error Mark as Complete task detail:', error);
    }
  };
  
  const openMarkCompleteDialog = (taskDetailId) => {
    setSelectedTaskDetailId(taskDetailId);
    setIsCompleteDialog(true);  // Đánh dấu là Mark as Complete
    toggleDialog();
  };
  
  return (
    <React.Fragment>
      <Container>
        <HeaderMain title="Tasks Details" className="mb-5 mt-4" />
        <Row>
          <Col lg={3}>
            <div className="mb-5">
              <div className="small mb-3">Task Information</div>
              <Table size="sm">
                <tbody>
                  <tr>
                    <td className="align-middle">Task Name</td>
                    <td className="text-right">
                      <span className="text-decoration-none">
                        {task.taskName}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Description</td>
                    <td className="text-right">{task.description}</td>
                  </tr>
                  <tr>
                    <td className="align-middle">Start Date</td>
                    <td className="text-right">
                      {new Date(task.startDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">End Date</td>
                    <td className="text-right">
                      {new Date(task.endDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Status</td>
                    <td className="text-right">
                      <Badge color={
                        task.status === 'Completed' ? 'danger' :
                        task.status === 'In_Progress' ? 'success' :
                        task.status === 'Not_Started' ? 'secondary' :
                        'warning'
                      }>
                        {task.status}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-middle">Progress</td>
                    <td className="text-right">
                      <div className="progress" >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${calculateTotalProgress()}%` }}
                          aria-valuenow={calculateTotalProgress()}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {calculateTotalProgress()}%
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>

            <div className="mb-4">
              <div className="small mb-3">Assigned Students</div>
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
            </div>
          </Col>

          <Col lg={9}>
            <ProjectsSmHeader
              subTitle="Tasks"
              subTitleLink="/apps/tasks-list"
              title="Task Details"
            />
            <Card>
              <CardBody>
                <div className="mb-4">
                  <div className="mb-3">
                    <span className="small mr-3">Task Details List</span>
                    <Badge pill color="secondary">
                      {task.taskDetails.length}
                    </Badge>
                  </div>
                  {task.taskDetails.map((detail) => (
                    <Card key={detail.taskDetailId} className="mb-3">
                      <CardBody>
                        <Media>
                          <Media body>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6>{detail.taskDetailName}</h6>
                                <Badge color={detail.isCompleted ? 'danger' : 'success'}>
                                  {detail.isCompleted ? 'Completed' : 'In Progress'}
                                </Badge>
                              </div>
                              <div>
                                {/* Check for assigned students and current user */}
                                {studentIdForUserId && assignedStudents.some(student => student.studentId === studentIdForUserId) && (
                                  <>
                                    {detail.isCompleted === false && task.status === 'In_Progress' && (
                                      <div className="d-flex justify-content-end">
                                        <button 
                                          type="button" 
                                          className="mb-2 btn btn-success btn-sm"
                                          onClick={() => openMarkCompleteDialog(detail.taskDetailId)}
                                        >
                                          Mark as Complete
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                                <div className="progress" style={{ width: '300px' }}>
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${detail.progressPercentage}%` }}
                                    aria-valuenow={detail.progressPercentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  >
                                    {detail.progressPercentage}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Media>
                        </Media>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={isDialogOpen} toggle={toggleDialog}>
        <ModalHeader toggle={toggleDialog}>
          Confirm Status Change
        </ModalHeader>
        <ModalBody>
            Are you sure you have COMPLETED the task?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDialog}>No</Button>
          <Button
            color="success"
            onClick={handleMarkComplete}
          >
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default TasksDetails;