import React, { useEffect, useState } from 'react';
import config from './../../../../config';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
} from '../../../components';
import { HeaderMain } from "../../components/HeaderMain";
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import { GroupContent } from "./components/GroupContent";
import GroupFormModal from '../Students/components/GroupFormModal';
import axios from 'axios';
import Cookies from 'js-cookie';
import GroupFilters from '../Students/components/GroupFilters';
import { Paginations } from "../../components/Paginations"; // Import component phân trang

const Groups = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [groupsPerPage, setGroupsPerPage] = useState(10);

    const [filters, setFilters] = useState({
        subjectCode: '',
        groupName: ''
    });
    const [filteredGroups, setFilteredGroups] = useState([]);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const loadGroups = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/group/group-campus`, {
                withCredentials: true,
            });
            if (response.data.success) {
                setGroups(response.data.data);
            }
        } catch (error) {
            console.error("Không thể tải danh sách nhóm!", error);
        }
    };

    useEffect(() => {
        loadGroups();
    }, []);

    useEffect(() => {
        filterGroups();
    }, [groups, filters]);

    const handleFilterChange = (filterName, value) => {
        if (filterName === 'reset') {
            setFilters({
                subjectCode: '',
                groupName: ''
            });
            return;
        }

        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const filterGroups = () => {
        let filtered = [...groups];

        // Filter by title/description
        if (filters.groupName) {
            const searchTerm = filters.groupName.toLowerCase();
            filtered = filtered.filter(Group =>
                Group.groupName.toLowerCase().includes(searchTerm)
            );
        }


        // Filter by assignee
        if (filters.subjectCode) {
            const searchTerm = filters.subjectCode.toLowerCase();
            filtered = filtered.filter(Group =>
                Group.subjectCode.toLowerCase().includes(searchTerm)
            )
        }

        setFilteredGroups(filtered);
    };

    // Tính toán chỉ số cho phân trang
    const indexOfLastGroup = currentPage * groupsPerPage;
    const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
    const currentGroups = filteredGroups.slice(indexOfFirstGroup, indexOfLastGroup);
    const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleGroupsPerPageChange = (event) => {
        setGroupsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    return (
        <React.Fragment>
            <Container fluid>
                <HeaderMain
                    title="Groups"
                    className="mb-5 mt-4"
                />
                <ProjectsSmHeader
                    subTitle="Groups"
                    onAddNewClick={toggleModal}
                />

                <Row>
                    <Col lg={12}>
                        <GroupFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </Col>
                    <Col lg={12}>
                        <Card className="mb-3">
                            <Table className="mb-0" responsive>
                                <thead>
                                    <tr>
                                        {/* <th className="bt-0">Group Id</th> */}
                                        <th className="bt-0">Group Name</th>
                                        <th className="bt-0">Subject</th>
                                        <th className="bt-0">Has Mentor</th>
                                        <th className="bt-0">Status</th>
                                        <th className="text-right bt-0">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <GroupContent groups={currentGroups} />
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>

                {/* Component phân trang */}
                <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onRecordsPerPageChange={handleGroupsPerPageChange}
                    recordsPerPage={groupsPerPage} // Số lượng nhóm trên mỗi trang
                />

                <GroupFormModal
                    isOpen={modalOpen}
                    toggle={toggleModal}
                    onGroupSaved={loadGroups}
                />
            </Container>
        </React.Fragment>
    );
};

export default Groups;
