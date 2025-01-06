import React, { useState, useEffect } from "react";
import {
    Card,
    Table,
    Container,
    Row,
    Col,
    Input,
    FormGroup,
    Label,
    Button,
} from "reactstrap";
import axios from "axios";
import config from "../../../../config";
import { showToast } from "../Notification";
import { TrTableGroupsList } from "./components/TrTableGroupsList";
import TrTableStudentsWithoutGroupList  from "./components/TrTableStudentsWithoutGroupList";
import { HeaderMain } from "../../components/HeaderMain";
import { Paginations } from "../../components/Paginations";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [studentsWithoutGroup, setStudentsWithoutGroup] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mentors, setMentors] = useState([]);
    const [filters, setFilters] = useState({
        groupName: "",
        status: "",
        mentor: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [groupsPerPage, setGroupsPerPage] = useState(10);

    const [currentPageForStudents, setCurrentPageForStudents] = useState(1);
    const [studentsPerPage, setStudentsPerPage] = useState(10);

    const handleAddMentorAutomatically = async () => {
        try {
            const response = await axios.post(
                `${config.apiBaseUrl}api/group/addmentortogroupautomatically`,
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                showToast("success", "Mentor added to group automatically!");
                fetchGroups();
            } else {
                showToast("error", response.data.errorMessage || "Failed to add mentor.");
            }
        } catch (error) {
            console.error("Error adding mentor automatically:", error);
            showToast("error", "An error occurred while adding mentor.");
        }
    };

    const handleAssignGroupsAutomatically = async () => {
        try {
            const response = await axios.post(
                `${config.apiBaseUrl}api/group/assigngroupsautomatically`,
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                showToast("success", "Groups have been successfully assigned!");
                fetchGroups();
            } else {
                showToast("error", response.data.errorMessage || "Failed to assign.");
            }
        } catch (error) {
            console.error("Error assign group automatically:", error);
            showToast("error", "An error occurred while adding mentor.");
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await axios.get(
                `${config.apiBaseUrl}api/group/getcurrentgroupswithmembersandmentor`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setGroups(response.data.data);
            } else {
                showToast("error", "Failed to fetch group data.");
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
            showToast("error", "An error occurred while fetching group data.");
        } finally {
            setLoading(false);
        }
    };
    const fetchStudentsWithoutGroup = async () => {
        try {
            const response = await axios.get(
                `${config.apiBaseUrl}api/students/getstudentwithoutgroup`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setStudentsWithoutGroup(response.data.data);
            } else {
                showToast("error", "Failed to fetch students without group.");
            }
        } catch (error) {
            console.error("Error fetching students without group:", error);
            showToast("error", "An error occurred while fetching students without group.");
        } finally {
            setLoading(false);
        }
    };

    const fetchMentors = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/mentor`, {
                withCredentials: true,
            });
            if (response.data.success) {
                setMentors(response.data.data);
            } else {
                showToast("error", "Failed to fetch mentor data.");
            }
        } catch (error) {
            console.error("Error fetching mentors:", error);
            showToast("error", "An error occurred while fetching mentor data.");
        }
    };

    useEffect(() => {
        fetchGroups();
        fetchMentors();
        fetchStudentsWithoutGroup();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        let filteredGroups = [...groups];

        if (filters.groupName) {
            filteredGroups = filteredGroups.filter((group) =>
                group.groupName.toLowerCase().includes(filters.groupName.toLowerCase())
            );
        }

        if (filters.status) {
            filteredGroups = filteredGroups.filter((group) => group.status === filters.status);
        }

        if (filters.mentor) {
            filteredGroups = filteredGroups.filter((group) =>
                group.mentor && group.mentor.mentorId.toString() === filters.mentor
            );
        }

        return filteredGroups;
    };

    const clearFilters = () => {
        setFilters({
            groupName: "",
            status: "",
            mentor: "",
        });
    };

    const indexOfLastGroup = currentPage * groupsPerPage;
    const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
    const currentGroups = applyFilters().slice(indexOfFirstGroup, indexOfLastGroup);
    const totalPages = Math.ceil(applyFilters().length / groupsPerPage);

    const indexOfLastStudent = currentPageForStudents * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = studentsWithoutGroup.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalStudentPages = Math.ceil(studentsWithoutGroup.length / studentsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const handleGroupsPerPageChange = (event) => {
        setGroupsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleStudentPageChange = (pageNumber) => setCurrentPageForStudents(pageNumber);
    const handleStudentsPerPageChange = (event) => {
        setStudentsPerPage(Number(event.target.value));
        setCurrentPageForStudents(1);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid>
            <HeaderMain title="Groups" className="mb-1 mt-4" />
            {/* <Row className="mb-2">
                <Col xs="auto">
                    <Button
                        color="primary"
                        size="sm"
                        onClick={() => handleAssignGroupsAutomatically()}
                    >
                        Assign Groups Automatically
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button
                        color="primary"
                        size="sm"
                        onClick={() => handleAddMentorAutomatically()}
                    >
                        Assign Mentors Automatically
                    </Button>
                </Col>
            </Row> */}
            <Card className="mb-3 p-3">
                <Row className="mb-3">
                    <Col md={3}>
                        <FormGroup>
                            <Label for="groupName">Group Name</Label>
                            <Input
                                type="text"
                                name="groupName"
                                id="groupName"
                                placeholder="Search by Group Name"
                                value={filters.groupName}
                                onChange={handleFilterChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="status">Status</Label>
                            <Input
                                type="select"
                                name="status"
                                id="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Statuses</option>
                                <option value="Initialized">Initialized</option>
                                <option value="Eligible">Eligible</option>
                                <option value="Approved">Approved</option>
                                <option value="Overdue">Overdue</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="mentor">Mentor</Label>
                            <Input
                                type="select"
                                name="mentor"
                                id="mentor"
                                value={filters.mentor}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Mentors</option>
                                {mentors.map((mentor) => (
                                    <option key={mentor.mentorId} value={mentor.mentorId}>
                                        {mentor.user.fullName}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={6} className="d-flex align-items-center" style={{ marginTop: '12px' }}>
                        <Button className="mr-2" color="secondary" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </Col>
                </Row>
            </Card>

            <Row>
                <Col lg={12}>
                    <Card className="mb-3">
                        <div className="table-responsive-xl">
                            <Table className="mb-0" hover>
                                <thead>
                                    <tr>
                                        <th className="align-middle bt-0">Group Name</th>
                                        <th className="align-middle bt-0">Campus</th>
                                        <th className="align-middle bt-0">Subject</th>
                                        <th className="align-middle bt-0">Status</th>
                                        <th className="align-middle bt-0">Number of Members</th>
                                        <th className="align-middle bt-0">Leader</th>
                                        <th className="align-middle bt-0">Mentor</th>
                                        <th className="align-middle bt-0">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentGroups.map((group) => (
                                        <TrTableGroupsList
                                            key={group.groupId}
                                            group={group}
                                            fetchGroups={fetchGroups}
                                            fetchStudentsWithoutGroup={fetchStudentsWithoutGroup}
                                        />
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Paginations
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onRecordsPerPageChange={handleGroupsPerPageChange}
                recordsPerPage={groupsPerPage}
            />
            <HeaderMain title="Students Without Group" className="mb-1 mt-4" />
            <Row>
                <Col lg={12}>
                    <Card className="mb-3">
                        <div className="table-responsive-xl">
                            <Table className="mb-0" hover>
                                <thead>
                                    <tr>
                                        <th className="align-middle bt-0">Student Name</th>
                                        <th className="align-middle bt-0">Email</th>
                                        <th className="align-middle bt-0">Phone</th>
                                        <th className="align-middle bt-0">Student Code</th>
                                        <th className="align-middle bt-0">Campus</th>
                                        <th className="align-middle bt-0">Subject</th>
                                        <th className="align-middle bt-0">Major</th>
                                        <th className="align-middle bt-0">Lecture</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentStudents.map((student) => (
                                        <TrTableStudentsWithoutGroupList
                                            key={student.userId}
                                            student={student}
                                        />
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Paginations
                currentPage={currentPageForStudents}
                totalPages={totalStudentPages}
                onPageChange={handleStudentPageChange}
                onRecordsPerPageChange={handleStudentsPerPageChange}
                recordsPerPage={studentsPerPage}
            />
        </Container>
    );
};

export default Groups;
