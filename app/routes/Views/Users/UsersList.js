import React, { useState } from 'react';
import {
    Card,
    CardFooter,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from './../../../components';
import { TrTableUsersList } from "./components/TrTableUsersList";
import { Paginations } from "../../components/Paginations";
import UserFormModal from './components/UserFormModal';
import StudentFormModal from './components/StudentFormModal';  
import MentorFormModal from './components/MentorFormModal';  
import config from '../../../../config';
import { showToast } from '../Notification';
import axios from 'axios';
import useAuth from './../../../../hooks/useAuth';

const UsersList = ({ users, onUserSaved }) => { 
    const { role, hasPermission } = useAuth();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [isModalOpen, setModalOpen] = useState(false);
    const [userData, setUserData] = useState(null);

    const handleDeleteClick = (userId) => {
        setUserIdToDelete(userId);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${config.apiBaseUrl}api/user/${userIdToDelete}`, { withCredentials: true });
            showToast('success', 'User deleted successfully');
            onUserSaved(); 
            setDialogOpen(false);
        } catch (error) {
            console.error("There was an error deleting the user!", error);
        }
    };

    const toggleDialog = () => setDialogOpen(!isDialogOpen);
    const toggleModal = () => {
        setModalOpen(!isModalOpen);
        setUserData(null);
    };

    const handleEditUser = (user) => {
        setUserData(user);
        setModalOpen(true);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleUsersPerPageChange = (event) => {
        setUsersPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const renderModal = () => {
        if (!userData) return null;

        if (userData.role?.name === 'Student') {
            return <StudentFormModal isOpen={isModalOpen} toggle={toggleModal} studentData={userData} onStudentSaved={onUserSaved} />;
        } else if (userData.role?.name === 'Mentor') {
            return <MentorFormModal isOpen={isModalOpen} toggle={toggleModal} userData={userData} onUserSaved={onUserSaved} />;
        } else {
            return <UserFormModal isOpen={isModalOpen} toggle={toggleModal} userData={userData} onUserSaved={onUserSaved} />;
        }
    };

    return (
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

            {renderModal()} 
        </Card>
    );
};

export default UsersList;
