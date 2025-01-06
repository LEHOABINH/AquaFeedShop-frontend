// MyTasks.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../../../config';
import useAuth from "../../../../../hooks/useAuth";
import { showToast } from "../../Utils/Toast";
import { Paginations } from "../../../components/Paginations";

import { 
    Container,
    Row,
    Col,
    Card,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '../../../../components';

import { HeaderMain } from "../../../components/HeaderMain";
import { ProjectsLeftNav } from "../../../components/Projects/ProjectsLeftNav";
import { ProjectsSmHeader } from "../../../components/Projects/ProjectsSmHeader";
import { TrTableMyTasksList } from "./components/TrTableMyTasksList";
import TaskListFilters from '../FormModal/TaskListFilters';

const MyTasks = (props) => {
    const [projectId, setProjectId] = useState(null);
    const [tasks, setTasks] = useState([]);
    const { id } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(5);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        status: '',
        title: '',
        startDate: '',
        endDate: '',
        progress: '',
        assignee: ''
    });
    // Add filtered tasks state
    const [filteredTasks, setFilteredTasks] = useState([]);

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
            setError('You currently have no projects.');
            console.error('Error fetching project ID:', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/task/byProject/myTasks/${projectId}`, {
                withCredentials: true,
            });
            
            if (response.data.success) {
                setTasks(response.data.data);
            } else {
                showToast('warning', 'Your Project has no tasks.');
                console.error('Failed to fetch tasks');
            }
        } catch (error) {
            setError('Your Project has no tasks.');
            console.error('Error fetching tasks:', error);
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

    useEffect(() => {
        filterTasks();
    }, [tasks, filters]);

    const handleFilterChange = (filterName, value) => {
        if (filterName === 'reset') {
            setFilters({
                status: '',
                title: '',
                startDate: '',
                endDate: '',
                progress: '',
                assignee: ''
            });
            return;
        }
        
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const filterTasks = () => {
        let filtered = [...tasks];

        // Filter by status
        if (filters.status) {
            filtered = filtered.filter(task => task.status === filters.status);
        }

        // Filter by title/description
        if (filters.title) {
            const searchTerm = filters.title.toLowerCase();
            filtered = filtered.filter(task => 
                task.taskName.toLowerCase().includes(searchTerm) ||
                task.description.toLowerCase().includes(searchTerm)
            );
        }

        // Filter by start date
        if (filters.startDate) {
            const filterStartDate = new Date(filters.startDate);
            filterStartDate.setHours(0, 0, 0, 0); // Set time to start of day

            filtered = filtered.filter(task => {
                const taskStartDate = new Date(task.startDate);
                taskStartDate.setHours(0, 0, 0, 0); // Set time to start of day
                return taskStartDate >= filterStartDate;
            });
        }

        // Filter by end date
        if (filters.endDate) {
            const filterEndDate = new Date(filters.endDate);
            filterEndDate.setHours(23, 59, 59, 999); // Set time to end of day

            filtered = filtered.filter(task => {
                const taskEndDate = new Date(task.endDate);
                taskEndDate.setHours(0, 0, 0, 0); // Set time to start of day
                return taskEndDate <= filterEndDate;
            });
        }

        // Filter by progress
        if (filters.progress) {
            const [min, max] = filters.progress.split('-').map(Number);
            filtered = filtered.filter(task => 
                task.progressPercentage >= min && task.progressPercentage <= max
            );
        }

        // Filter by assignee
        if (filters.assignee) {
            const searchTerm = filters.assignee.toLowerCase();
            filtered = filtered.filter(task => 
                task.taskAssigns.some(assign => 
                    assign.studentId.toString().includes(searchTerm)
                )
            );
        }

        setFilteredTasks(filtered);
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredTasks.length / usersPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const handleUsersPerPageChange = (event) => {
        setUsersPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    return (
        <React.Fragment>
            <Container>
                <HeaderMain 
                    title="My Tasks"
                    className="mb-5 mt-4"
                />
                <Row>
                    <Col lg={ 12 }>
                        <ProjectsSmHeader
                            subTitle="Tasks List"
                            subTitleLink="/apps/tasks-list"
                            title="My Tasks"
                            linkList="/apps/my-tasks-list"
                            btnShowKanban
                            linkKanban="/apps/my-tasks-kanban"
                        />
                        <TaskListFilters 
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
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
                                    {error ? (
                                        <tr style={{ backgroundColor: '#fff8e1', color: '#ff9800', fontWeight: 'bold', textAlign: 'center' }}>
                                            <td colSpan="7">
                                                {error}
                                            </td>
                                        </tr>
                                    ) : (
                                        currentTasks.map((task) => (
                                            <TrTableMyTasksList 
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
                                        ))
                                    )}
                                    </tbody>
                                </Table>
                            </div>
                            <Paginations
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                onRecordsPerPageChange={handleUsersPerPageChange}
                                recordsPerPage={usersPerPage}
                            />
                        </Card>
                    </Col>
                </Row>

            </Container>
        </React.Fragment>
    );
};

export default MyTasks;