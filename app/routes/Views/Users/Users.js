import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Input, Label, Button, Card, FormGroup, Spinner, Table, Modal, ModalHeader, ModalBody, ModalFooter } from './../../../components';
import { HeaderMain } from "../../components/HeaderMain";
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import UserFormModal from './components/UserFormModal';
import MentorFormModal from './components/MentorFormModal';
import StudentFormModal from './components/StudentFormModal';
import RoleSelectionModal from './components/RoleSelectionModal';
import { showToast } from '../Notification';
import config from '../../../../config';
import axios from 'axios';
import useAuth from './../../../../hooks/useAuth';
import { TrTableUsersList } from "./components/TrTableUsersList";
import { Paginations } from "../../components/Paginations";
import { ClipLoader } from 'react-spinners';
import { HubConnectionBuilder } from "@microsoft/signalr";
import ImportUserModal from "./components/ImportUserModal";

const Users = (props) => {
    const connection = useRef(null);
    const [importUserProgress, setImportUserProgress] = useState({ current: 0, total: 0 });
    const { role, hasPermission } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState({
        name: '', campus: '', role: '', email: '', phone: '',
    });
    const [campuses, setCampuses] = useState([]);
    const [roles, setRoles] = useState([]);
    const [fileInput, setFileInput] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [isModalOpen, setModalOpenUser] = useState(false);
    const [userData, setUserData] = useState(null);

    const [isImportUserModalOpen, setIsImportUserModalOpen] = useState(false);
    const [importUserErrors, setImportUserErrors] = useState([]);

    const toggleModal = () => setModalOpen(!modalOpen);
    const toggleRoleModal = () => setRoleModalOpen(!roleModalOpen);
    const toggleDialog = () => setDialogOpen(!isDialogOpen);
    const toggleModalUser = () => {
        setModalOpenUser(!isModalOpen);
        setUserData(null);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/user`, { withCredentials: true });
            const usersData = response.data.data;
            const reversedUsers = [...usersData].reverse(); 
            setUsers(reversedUsers); 
            setFilteredUsers(reversedUsers); 
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchCampuses = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/campus`, { withCredentials: true });
            setCampuses(response.data.data);
        } catch (error) {
            console.error('Error fetching campuses:', error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/role`, { withCredentials: true });
            setRoles(response.data.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchCampuses();
        fetchRoles();
    }, []);

    useEffect(() => {
        handleFilter();
    }, [searchCriteria]);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilter = () => {
        let filtered = [...users];

        if (searchCriteria.name) {
            filtered = filtered.filter(user => user.fullName.includes(searchCriteria.name));
        }

        if (searchCriteria.campus) {
            filtered = filtered.filter(user => user.campus.campusCode === searchCriteria.campus);
        }

        if (searchCriteria.role) {
            filtered = filtered.filter(user => user.role.name === searchCriteria.role);
        }

        if (searchCriteria.email) {
            filtered = filtered.filter(user => user.email.toLowerCase().includes(searchCriteria.email.toLowerCase()));
        }

        if (searchCriteria.phone) {
            filtered = filtered.filter(user => user.phone.toString().includes(searchCriteria.phone));
        }

        setFilteredUsers(filtered);
    };

    const handleClear = () => {
        setSearchCriteria({
            name: '', campus: '', role: '', email: '', phone: '',
        });
        setFilteredUsers(users);
    };

    const handleFileClick = () => {
        if (fileInput) {
            fileInput.click();
        }
    };

    useEffect(() => {
        connection.current = new HubConnectionBuilder()
          .withUrl(`${config.apiBaseUrl}userHub`)
          .build();
    
          const startConnection = async () => {
            try {
              await connection.current.start();
              console.log("SignalR Connected");
            } catch (err) {
              console.log("Error while starting connection:", err);
            }
          };
    
            connection.current.on("ReceiveImportUserProgress", (current, total) => {
                console.log("Progress received:", current, total);
                setImportUserProgress({ current, total });
            });
    
        startConnection();
    
        return () => {
          connection.current.stop();
        };
    }, []);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("excelFile", file);

            setIsUploading(true);

            try {
                const response = await axios.post(`${config.apiBaseUrl}api/user/upload-excel`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });

                if (response.data.success) {
                    if (response.data.data === null){
                        showToast("success", "User created successfully!");
                        fetchUsers();
                    } else{
                        setImportUserErrors(response.data.data)
                        setIsImportUserModalOpen(true);
                    }
                } else {
                    showToast("error", response.data.errorMessage || "User creation failed!");
                }
            } catch (error) {
                console.error("Error uploading file:", error);
                showToast("error", ` ${error.response?.data?.errorMessage || "Something went wrong!"}`);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleDeleteClick = (userId) => {
        setUserIdToDelete(userId);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${config.apiBaseUrl}api/user/${userIdToDelete}`, { withCredentials: true });
            showToast('success', 'User deleted successfully');
            fetchUsers();
            setDialogOpen(false);
        } catch (error) {
            console.error("There was an error deleting the user!", error);
        }
    };

    const handleEditUser = (user) => {
        setUserData(user);
        setModalOpenUser(true);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleUsersPerPageChange = (event) => {
        setUsersPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const renderModal = () => {
        if (!userData) return null;

        if (userData.role?.name === 'Student') {
            return <StudentFormModal isOpen={isModalOpen} toggle={toggleModalUser} studentData={userData} onStudentSaved={fetchUsers} />;
        } else if (userData.role?.name === 'Mentor') {
            return <MentorFormModal isOpen={isModalOpen} toggle={toggleModalUser} mentorData={userData} onMentorSaved={fetchUsers} />;
        } else {
            return <UserFormModal isOpen={isModalOpen} toggle={toggleModalUser} userData={userData} onUserSaved={fetchUsers} />;
        }
    };

    return (
        <Container fluid>
            <HeaderMain title="Users" className="mb-1 mt-4" />
            <Card className="mb-3 p-3">
                <Row>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="searchName">Name</Label>
                            <Input type="text" id="searchName" name="name" placeholder="Enter name" value={searchCriteria.name} onChange={handleSearchChange} />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="searchCampus">Campus</Label>
                            <Input type="select" id="searchCampus" name="campus" value={searchCriteria.campus} onChange={handleSearchChange}>
                                <option value="">All Campuses</option>
                                {campuses.map((campus) => (
                                    <option key={campus.campusId} value={campus.campusCode}>
                                        {campus.campusName}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="searchRole">Role</Label>
                            <Input type="select" id="searchRole" name="role" value={searchCriteria.role} onChange={handleSearchChange}>
                                <option value="">All Roles</option>
                                {roles.map((role) => (
                                    <option key={role.roleId} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="searchEmail">Email</Label>
                            <Input type="email" id="searchEmail" name="email" placeholder="Enter email" value={searchCriteria.email} onChange={handleSearchChange} />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="searchPhone">Phone</Label>
                            <Input type="number" id="searchPhone" name="phone" placeholder="Enter phone number" value={searchCriteria.phone} onChange={handleSearchChange} />
                        </FormGroup>
                    </Col>
                    <Col md={6} className="d-flex align-items-center" style={{ marginTop: '12px' }}>
                        <Button color="secondary" className="mr-2" onClick={handleClear}>
                            Clear
                        </Button>
                        {hasPermission("import_user") && (
                            <Button
                                color="primary"
                                className="mr-2"
                                onClick={handleFileClick}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <>
                                        <Spinner size="sm" className="mr-1" /> 
                                        {`Importing ${importUserProgress.current}/${importUserProgress.total}`}
                                    </>
                                ) : (
                                    'Upload File'
                                )}
                            </Button>
                        )}
                        <input
                            type="file"
                            accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            style={{ display: 'none' }}
                            ref={input => setFileInput(input)}
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        {isUploading && <ClipLoader size={30} color="#007bff" loading={isUploading} />}
                    </Col>
                </Row>
            </Card>

            <Row>
                <Col lg={12}>
                    {hasPermission("create_user") && (
                        <ProjectsSmHeader onAddNewClick={toggleRoleModal} />
                    )}
                    <Card className="mb-3">
                        <div className="table-responsive-xl">
                            <Table className="mb-0" hover>
                                <thead>
                                    <tr>
                                        <th className="align-middle bt-0">Name</th>
                                        <th className="align-middle bt-0">Email</th>
                                        <th className="align-middle bt-0">Phone</th>
                                        <th className="align-middle bt-0">Campus</th>
                                        <th className="align-middle bt-0">Role</th>
                                        <th className="align-middle bt-0 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user) => (
                                        <TrTableUsersList
                                            key={user.userId}
                                            user={user}
                                            onDelete={() => handleDeleteClick(user.userId)}
                                            onEdit={() => handleEditUser(user)}
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
                onRecordsPerPageChange={handleUsersPerPageChange}
                recordsPerPage={usersPerPage}
            />

            <Modal isOpen={isDialogOpen} toggle={toggleDialog}>
                <ModalHeader toggle={toggleDialog}>Confirm Deletion</ModalHeader>
                <ModalBody>Are you sure you want to delete this user?</ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleDialog}>Cancel</Button>
                    <Button color="danger" onClick={handleDelete}>Delete</Button>
                </ModalFooter>
            </Modal>

            <RoleSelectionModal isOpen={roleModalOpen} toggle={toggleRoleModal} roles={roles} onUserSaved={fetchUsers} />
            <ImportUserModal
                isOpen={isImportUserModalOpen}
                toggle={() => setIsImportUserModalOpen(!isImportUserModalOpen)}
                errors={importUserErrors}
            />
            {renderModal()}
        </Container>
    );
};

export default Users;
