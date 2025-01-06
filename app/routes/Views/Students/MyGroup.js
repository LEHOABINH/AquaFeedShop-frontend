import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '../../../components';
import axios from 'axios';
import config from '../../../../config';
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import { MyGroupContent } from "./components/MyGroupContent";
import AddMemberFormModal from '../Students/components/AddMemberFormModal';
import UpdateGroupFormModal from '../Students/components/UpdateGroupFormModal';
import { HeaderMain } from "../../components/HeaderMain";
import { showToast } from "../Utils/Toast";

const MyGroup = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [groupId, setGroupId] = useState(null);
    const [groupName, setGroupName] = useState('');
    const [status, setStatus] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [mentorName, setMentorName] = useState('No mentor');
    const [userRole, setUserRole] = useState(null);

    const toggleDialog = () => setIsDialogOpen(!isDialogOpen);
    const toggleModal = () => {
        if (!groupId) {
            showToast("error", "Group ID is missing. Please select a group first.");
            return;
        }
        setModalOpen(!modalOpen);
    };

    const toggleUpdateModal = () => setUpdateModalOpen(!updateModalOpen);

    const handleGroupData = (groupIdFromContent, groupNameFromContent, mentorNameFromContent, statusFromContent, subjectCodeFromContent) => {
        setGroupId(groupIdFromContent);
        setGroupName(groupNameFromContent);
        setMentorName(mentorNameFromContent);
        setStatus(statusFromContent);
        setSubjectCode(subjectCodeFromContent);
    };

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}api/role/GetRoleByUserId`, {
                    withCredentials: true,
                });
                if (response.data.success) {
                    setUserRole(response.data.data);
                } else {
                    console.error('Failed to fetch Group Member Role');
                }
            } catch (error) {
                console.error('Error fetching Group Member Role:', error);
            }
        };

        fetchUserRole();
    }, []);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `${config.apiBaseUrl}api/groupMember/DeleteGroup?groupId=${groupId}`,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            if (response.data.success) {
                showToast("success", response.data.data?.message || "Deleted group successfully!");
                toggleDialog();
                setGroupName('');
                setMentorName('No mentor');
                setGroupId(null);
            } else {
                throw new Error(response.data.errorMessage || "Unexpected error occurred.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.groupId?.[0] || error.message || "Failed to delete group.";
            showToast("error", errorMessage);
        }
    };

    const handleDeleteClick = () => {
        if (groupId) {
            toggleDialog();
        } else {
            showToast("error", "Group ID is missing. Please select a group first.");
        }
    };

    const handleGroupUpdated = (updatedGroupName) => {
        setGroupName(updatedGroupName);
        toggleUpdateModal();
    };

    return (
        <React.Fragment>
            <Container fluid>
                <HeaderMain
                    title={
                        <span>
                            {`${groupName || "No group"} `}
                            {groupName && userRole === "Leader" && (
                                <span
                                    style={{ cursor: "pointer", color: "#1EB7FF" }}
                                    onClick={toggleUpdateModal}
                                >
                                    <i className="fa fa-fw fa-edit mr-2" style={{ fontSize: "0.4em" }}></i>
                                </span>
                            )}
                            {` - Mentor: ${mentorName || "No mentor"}`}
                        </span>
                    }
                    className="mb-3 mt-4"
                />
                {groupName && (
                    <span className="mr-2 badge badge-primary badge-pill" style={{ padding: "10px 20px" }}>
                        {subjectCode} - {status}
                    </span>
                )}
                <ProjectsSmHeader
                    subTitle="My Group"
                    onAddNewClick={userRole === "Leader" ? toggleModal : null}
                />

                {userRole === "Leader" && (
                    <Row className="mb-3">
                        <Col className="text-right">
                            <Button color="danger" onClick={handleDeleteClick}>
                                Delete group
                            </Button>
                        </Col>
                    </Row>
                )}

                <Row>
                    <Col lg={12}>
                        <Card className="mb-3">
                            <Table className="mb-0" responsive>
                                <thead>
                                    <tr>
                                        <th className="bt-0">Full Name</th>
                                        <th className="bt-0">Email</th>
                                        <th className="bt-0">Major</th>
                                        <th className="bt-0">Student Code</th>
                                        <th className="bt-0">Role</th>
                                        {userRole === 'Leader' && <th className="text-right">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    <MyGroupContent onGroupDataChange={handleGroupData} userRole={userRole} />
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>

                <AddMemberFormModal
                    isOpen={modalOpen}
                    toggle={toggleModal}
                    groupId={groupId}
                    groupName={groupName}
                />

                <UpdateGroupFormModal
                    isOpen={updateModalOpen}
                    toggle={toggleUpdateModal}
                    onGroupSaved={handleGroupUpdated}
                    groupId={groupId}
                    groupName={groupName}
                />

                <Modal isOpen={isDialogOpen} toggle={toggleDialog}>
                    <ModalHeader toggle={toggleDialog}>Confirm Deletion</ModalHeader>
                    <ModalBody>Are you sure you want to delete this group?</ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleDialog}>Cancel</Button>
                        <Button color="danger" onClick={handleDelete}>Delete</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </React.Fragment>
    );
};

export default MyGroup;
