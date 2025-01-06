import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from './../../../../config';
import { Paginations } from "./../../components/Paginations";

import { 
    Card,
    Table
} from './../../../components';
import { TrTableProjectsList } from "./components/TrTableProjectsList";

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(5);
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}api/projects`, {
                    withCredentials: true,
                });
                
                if (response.data.success) {
                    setProjects(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProjects();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu
    }

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentProjects = projects.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(projects.length / usersPerPage);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const handleUsersPerPageChange = (event) => {
        setUsersPerPage(Number(event.target.value));
        setCurrentPage(1);
    };
    
    return (
        <Card className="mb-3">
            { /* START Table */}
            <div className="table-responsive-xl">
                <Table className="mb-0" hover>
                    <thead>
                        <tr>
                            <th className="align-middle bt-0">Status</th>
                            <th className="align-middle bt-0">Project</th>
                            <th className="align-middle bt-0">Description</th>
                            <th className="align-middle bt-0">Subject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProjects.map(project => (
                            <TrTableProjectsList key={project.projectId} project={project} />
                        ))}
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
    );
};

export default ProjectsList;
