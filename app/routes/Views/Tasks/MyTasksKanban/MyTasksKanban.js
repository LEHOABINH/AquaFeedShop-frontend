import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './../../../../../config';
import useAuth from "../../../../../hooks/useAuth";
import { showToast } from "./../../Utils/Toast";

import { 
    Container,
    Row,
    Col,
    Card,
    CardTitle,
    CardBody,
    CardFooter,
    Badge,
    UncontrolledTooltip
} from '../../../../components';

import { HeaderMain } from "../../../components/HeaderMain";
import { ProjectsSmHeader } from "../../../components/Projects/ProjectsSmHeader";
import { MyTasksCardGrid } from "./components/MyTasksCardGrid";

const MyTasksKanban = () => {
    const [projectId, setProjectId] = useState(null);
    const { id } = useAuth();
    const [columns, setColumns] = useState({
        'Not_Started': {
            title: 'Not Started',
            items: []
        },
        'In_Progress': {
            title: 'In Progress',
            items: []
        },
        'Completed': {
            title: 'Completed',
            items: []
        },
        'Overdue': {
            title: 'Overdue',
            items: []
        }
    });

    // Fetch project ID based on the user
    const fetchProjectId = async () => {
        try {
            const responseProjectId = await axios.get(`${config.apiBaseUrl}api/projects/getProjectId/${id}`, {
                withCredentials: true,
            });

            if (responseProjectId.data.success) {
                setProjectId(responseProjectId.data.data);  // Set projectId here
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
            const response = await axios.get(`${config.apiBaseUrl}api/task/byProject/myTasks/${projectId}`, {
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
                        items: response.data.data.filter(task => task.status === 'Not_Started')
                    },
                    'In_Progress': {
                        title: 'In Progress',
                        items: response.data.data.filter(task => task.status === 'In_Progress')
                    },
                    'Completed': {
                        title: 'Completed',
                        items: response.data.data.filter(task => task.status === 'Completed')
                    },
                    'Overdue': {
                        title: 'Overdue',
                        items: response.data.data.filter(task => task.status === 'Overdue')
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
        fetchProjectId();
    }, [id]);

    useEffect(() => {
        if (projectId) {
            fetchTasks();
        }
    }, [projectId]);

    const getStatusBadgeClass = (status) => {
        switch (status) {
          case 'Not Started':
            return 'badge badge-secondary';
          case 'In Progress':
            return 'badge badge-info';
          case 'Overdue':
            return 'badge badge-warning';
          case 'Completed':
            return 'badge badge-danger';
          default:
            return 'badge badge-primary';
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
                            title="My Tasks"
                            subTitle="Tasks List"
                            subTitleLink="/apps/tasks-list"
                            linkList="/apps/my-tasks-list"
                            btnShowKanban
                            linkKanban="/apps/my-tasks-kanban"
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
                                                        <MyTasksCardGrid
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
            </Container>
        </React.Fragment>
    );
};

export default MyTasksKanban;