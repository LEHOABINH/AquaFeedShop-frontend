import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './../../../../../config';
import useAuth from "../../../../../hooks/useAuth";
import { showToast } from "./../../Utils/Toast";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { 
    Container,
    Row,
    Col,
    Card,
    CardTitle,
    CardBody,
    CardFooter,
    Badge,
    UncontrolledTooltip,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '../../../../components';

import { HeaderMain } from "../../../components/HeaderMain";
import { ProjectsSmHeader } from "../../../components/Projects/ProjectsSmHeader";
import { TasksCardGrid } from "./components/TasksCardGrid";
import TaskFormModel from './../FormModal/TaskFormModel';

const TasksKanban = () => {
    const [projectId, setProjectId] = useState(null);
    const { id } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // State for delete confirmation
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [taskIdToDelete, setTaskIdToDelete] = useState(null);
    const [columns, setColumns] = useState({
        'Not_Started': {
            title: 'Not Started',
            items: [],
            isFixed: true
        },
        'In_Progress': {
            title: 'In Progress',
            items: [],
            isFixed: false
        },
        'Completed': {
            title: 'Completed',
            items: [],
            isFixed: false
        },
        'Overdue': {
            title: 'Overdue',
            items: [],
            isFixed: true
        }
    });

    const [groupMemberRole, setGroupMemberRole] = useState(null);
    // Fetch project ID based on the user
    const fetchGroupMemberRole = async () => {
        try {
            const responseGroupMemberRole = await axios.get(`${config.apiBaseUrl}api/groupMember/GetGroupMemberByUserID`, {
                withCredentials: true,
            });
  
            if (responseGroupMemberRole.data.success) {
                setGroupMemberRole(responseGroupMemberRole.data.data.role);
                console.log(groupMemberRole);
            } else {
                console.error('Failed to fetch project ID');
            }
        } catch (error) {
            console.error('Error fetching project ID:', error);
        }
    };
    
    // Fetch project ID based on the user
    const fetchProjectId = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/projects/getProjectId/${id}`, {
                withCredentials: true,
            });

            if (response.data.success) {
                setProjectId(response.data.data);  // Set projectId here
            } else {
                showToast('warning', 'You do not have any Project in the current semester.');
                console.error('Failed to fetch project ID');
            }
        } catch (error) {
            console.error('Error fetching project ID:', error);
        }
    };
    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/task/byProject/${projectId}`, {
                withCredentials: true,
            });
            if (response.data.success) {
                const tasksMap = response.data.data.reduce((acc, task) => {
                    acc[task.taskId] = task;
                    return acc;
                }, {});
                
                const newColumns = {
                    'Not_Started': {
                        title: 'Not Started',
                        items: response.data.data.filter(task => task.status === 'Not_Started'),
                        isFixed: true
                    },
                    'In_Progress': {
                        title: 'In Progress',
                        items: response.data.data.filter(task => task.status === 'In_Progress'),
                        isFixed: false
                    },
                    'Completed': {
                        title: 'Completed',
                        items: response.data.data.filter(task => task.status === 'Completed'),
                        isFixed: false
                    },
                    'Overdue': {
                        title: 'Overdue',
                        items: response.data.data.filter(task => task.status === 'Overdue'),
                        isFixed: true
                    }
                };
                setColumns(newColumns);
            } else {
                showToast('warning', 'Your Project has no tasks.');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            showToast('error', 'Failed to fetch tasks');
        }
    };
    
    useEffect(() => {
        fetchGroupMemberRole(); // Gọi fetchGroupMemberRole để lấy role
        fetchProjectId();       // Gọi fetchProjectId để lấy projectId
    }, [id]);

    // Fetch tasks when projectId changes
    useEffect(() => {
        if (projectId) {
            fetchTasks();
        }
    }, [projectId]);

    const handleTaskSaved = () => {
        fetchTasks();
        setModalOpen(false);
        setSelectedTask(null);
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    const handleAddNewTask = () => {
        setSelectedTask(null);
        setModalOpen(true);
    };

    const toggleDeleteDialog = () => {
        setIsDeleteDialogOpen(!isDeleteDialogOpen);
    };

    const handleDeleteTask = (taskId) => {
        setTaskIdToDelete(taskId);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async (taskId) => {
        try {
            const response = await axios.delete(`${config.apiBaseUrl}api/task/${taskIdToDelete}`, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (response.data.success) {
                showToast('success', 'Task deleted successfully');
                fetchTasks();
                setIsDeleteDialogOpen(false);
            } else {
                showToast('error', 'Failed to delete task');
            }
        } catch (error) {
            showToast('error', 'Error deleting task');
            console.error('Error deleting task:', error);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
          case 'Not Started':
            return 'badge badge-secondary'; // Màu Xám
          case 'In Progress':
            return 'badge badge-info'; // Màu Xanh Lá
          case 'Overdue':
            return 'badge badge-warning '; // Màu Vàng Cam
          case 'Completed':
            return 'badge badge-danger'; // Màu Đỏ
          default:
            return 'badge badge-primary'; // Mặc định Màu Xanh Dương, nếu không khớp với các trạng thái trên
        }
      };

    return (
        <React.Fragment>
            <Container>
                <HeaderMain 
                    title="Tasks Kanban"
                    className="mb-5 mt-4"
                />
                <Row>
                    <Col lg={12}>
                        <ProjectsSmHeader 
                            title="Tasks Kanban"
                            subTitle="Projects"
                            subTitleLink="/apps/projects/list"
                            linkList="/apps/tasks-list"
                            btnShowKanban
                            linkKanban="/apps/tasks-kanban"
                        />
                        <div className="d-flex justify-content-between">
                            {Object.entries(columns).map(([columnId, column]) => (
                                <div key={columnId} className="flex-grow-1 mx-2">
                                    <Card>
                                        <CardBody>
                                            <div className="mb-4">
                                                <CardTitle tag="h6">
                                                    <span className={getStatusBadgeClass(column.title)}>
                                                        {column.title}
                                                    </span>
                                                    <Badge pill color="secondary" className="ml-2">
                                                        {column.items.length}
                                                    </Badge>
                                                </CardTitle>
                                            </div>
                                            <div 
                                                style={{ 
                                                    minHeight: '50px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '1rem'
                                                }}
                                            >
                                                {column.items.map((task) => (
                                                    <div key={task.taskId}>
                                                        <TasksCardGrid
                                                            taskId={task.taskId}
                                                            taskName={task.taskName}
                                                            description={task.description}
                                                            startDate={task.startDate}
                                                            endDate={task.endDate}
                                                            status={task.status}
                                                            progress={task.progressPercentage}
                                                            taskAssigns={task.taskAssigns}
                                                            onEdit={() => handleEditTask(task)}
                                                            onDelete={() => handleDeleteTask(task.taskId)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </CardBody>
                                        <CardFooter className="text-center">
                                            {/* <a href="#">
                                                <i className="fa fa-plus text-success mr-2"></i>
                                                Add Task
                                            </a> */}
                                        </CardFooter>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* Delete Confirmation Dialog */}
                <Modal isOpen={isDeleteDialogOpen} toggle={toggleDeleteDialog}>
                    <ModalHeader toggle={toggleDeleteDialog}>Confirm Deletion</ModalHeader>
                    <ModalBody>Are you sure you want to delete this task?</ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleDeleteDialog}>Cancel</Button>
                        <Button color="danger" onClick={handleDelete}>Delete</Button>
                    </ModalFooter>
                </Modal>

                <TaskFormModel
                    isOpen={modalOpen}
                    toggle={() => setModalOpen(!modalOpen)}
                    taskData={selectedTask}
                    onTaskSaved={handleTaskSaved}
                />
            </Container>
        </React.Fragment>
    );
};

export default TasksKanban;