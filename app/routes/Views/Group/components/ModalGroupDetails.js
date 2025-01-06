import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Input, Form, FormGroup, Label } from "../../../../components";
import { showToast } from "../../Notification";
import config from "../../../../../config";

const ModalGroupDetails = ({ group, isOpen, toggleModal, onDeleteMember, fetchGroups, fetchStudentsWithoutGroup }) => {
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState("");
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [newStudentCode, setNewStudentCode] = useState("");

    useEffect(() => {
        if (group?.mentor) {
            setSelectedMentor(group.mentor?.mentorId || "");
        }
    }, [group]);

    useEffect(() => {
        if (isOpen && group?.groupMembers?.length > 0) {
            const campusId = group?.groupMembers[0]?.campusId;
            if (campusId) {
                axios
                    .get(`${config.apiBaseUrl}api/mentor/getmentorsbycampusid?campusId=${campusId}`, {
                        withCredentials: true,
                    })
                    .then((response) => {
                        if (response.data.success) {
                            setMentors(response.data.data);
                        }
                    })
                    .catch((error) => console.error("Error fetching mentors:", error));
            }
        }
    }, [isOpen, group]);

    const handleMentorChange = (e) => {
        setSelectedMentor(e.target.value);
    };

    const handleSaveClick = () => {
        if (!selectedMentor) {
            showToast("error", "Please select a mentor before saving.");
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const handleConfirmSave = async () => {
        setIsConfirmModalOpen(false);

        try {
            const response = await axios.post(
                `${config.apiBaseUrl}api/mentor/assignmentortogroup?groupId=${group.groupId}&mentorId=${selectedMentor}`,
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                showToast("success", "Mentor updated successfully!");
                toggleModal();
                fetchGroups();
            } else {
                showToast("error", "Failed to update the mentor. Please try again.");
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                showToast("error", "Editing mentors is not allowed after the specified date.");
            } else {
                console.error("Error updating mentor:", error);
                showToast("error", "An error occurred while updating the mentor.");
            }
        }
    };

    const handleAddMemberClick = () => {
        setIsAddMemberModalOpen(true);
    };

    const handleAddMemberConfirm = async () => {
        setIsAddMemberModalOpen(false);
        if (!newStudentCode) {
            showToast("error", "Please enter a valid Student Code.");
            return;
        }

        try {
            const response = await axios.post(
                `${config.apiBaseUrl}api/group/addstudenttogroup?groupId=${group.groupId}&studentCode=${newStudentCode}`,
                {},
                { withCredentials: true }
            );

            if (response.data.success) {
                showToast("success", "Student added to group successfully!");
                fetchGroups();
                fetchStudentsWithoutGroup();
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                showToast("error", error.response.data.errorMessage || "An error occurred while adding the student.");
            } else {
                console.error("Error adding student:", error);
                showToast("error", "An error occurred while adding the student.");
            }
        }
    };

    const handlePasteStudentCode = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setNewStudentCode(text);
        } catch (error) {
            console.error("Failed to read from clipboard:", error);
            showToast("error", "Unable to read clipboard. Please try again.");
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} toggle={toggleModal} size="xl">
                <ModalHeader toggle={toggleModal}>Group Members Details</ModalHeader>
                <ModalBody>
                    <div className="mb-3">
                        <label htmlFor="mentorSelect" className="form-label">
                            Select Mentor
                        </label>
                        <Input
                            type="select"
                            id="mentorSelect"
                            value={selectedMentor}
                            onChange={handleMentorChange}
                        >
                            <option value="">-- Select Mentor --</option>
                            {mentors.map((mentor) => (
                                <option key={mentor.mentorId} value={mentor.mentorId}>
                                    {mentor.user?.fullName || "No Name"}
                                </option>
                            ))}
                        </Input>
                    </div>
                    <Button color="primary" onClick={handleAddMemberClick}>
                        <i className="fa fa-plus"></i> Add Member
                    </Button>
                    <Table>
                        <thead>
                            <tr>
                                <th className="align-middle">Name</th>
                                <th className="align-middle">Student Code</th>
                                <th className="align-middle">Major</th>
                                <th className="align-middle">Role</th>
                                {/*<th className="align-middle text-center">Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {group?.groupMembers?.map((member) => (
                                <tr key={member.studentId}>
                                    <td>{member?.fullName || "Unknown"}</td>
                                    <td>{member?.studentCode || "N/A"}</td>
                                    <td>{member?.major || "N/A"}</td>
                                    <td>{member?.role || "N/A"}</td>
                                    {/* <td className="align-middle text-center">
                                        <Button
                                            color="danger"
                                            size="sm"
                                            onClick={() => onDeleteMember(member.studentId)}
                                        >
                                            <i className="fa fa-trash-o"></i>
                                        </Button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSaveClick}>
                        Save
                    </Button>
                    <Button color="secondary" onClick={toggleModal}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={isAddMemberModalOpen} toggle={() => setIsAddMemberModalOpen(false)}>
                <ModalHeader toggle={() => setIsAddMemberModalOpen(false)}>Add New Member</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="studentCode">Student Code</Label>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <Input
                                    type="text"
                                    id="studentCode"
                                    value={newStudentCode}
                                    onChange={(e) => setNewStudentCode(e.target.value)}
                                    placeholder="Enter or paste student code"
                                />
                                <Button color="info" onClick={handlePasteStudentCode} title="Paste from clipboard">
                                    <i className="fa fa-clipboard" aria-hidden="true"></i>
                                </Button>
                            </div>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleAddMemberConfirm}>
                        Add
                    </Button>
                    <Button color="secondary" onClick={() => setIsAddMemberModalOpen(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={isConfirmModalOpen} toggle={() => setIsConfirmModalOpen(false)}>
                <ModalHeader toggle={() => setIsConfirmModalOpen(false)}>Confirm Mentor Change</ModalHeader>
                <ModalBody>
                    Are you sure you want to change the mentor for this group?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleConfirmSave}>
                        Yes
                    </Button>
                    <Button color="secondary" onClick={() => setIsConfirmModalOpen(false)}>
                        No
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

ModalGroupDetails.propTypes = {
    group: PropTypes.shape({
        groupId: PropTypes.number.isRequired,
        groupName: PropTypes.string.isRequired,
        groupMembers: PropTypes.array.isRequired,
        mentor: PropTypes.shape({
            mentorId: PropTypes.number,
            fullName: PropTypes.string,
            specialty: PropTypes.string,
        }),
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    onDeleteMember: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired,
    fetchStudentsWithoutGroup: PropTypes.func.isRequired,
};

export default ModalGroupDetails;
