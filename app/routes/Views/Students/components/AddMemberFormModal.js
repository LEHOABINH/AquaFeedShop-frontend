import React, { useState } from 'react';
import config from '../../../../../config';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Card,
    CardBody,
    CardTitle,
    Form,
    FormGroup,
    Label,
    Input
} from '../../../../components';
import axios from 'axios';
import Cookies from 'js-cookie';
import { showToast } from "./../../Utils/Toast"; 

const AddMemberFormModal = ({ isOpen, toggle, onGroupSaved, groupId, groupName }) => {
    const [studentCode, setStudentCode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!groupId) {
            console.error('Group ID is missing.');
            return;
        }

        const requestData = {
            groupId: groupId,
            studentCode: studentCode.trim()
        };

        try {
            const response = await axios.post(`${config.apiBaseUrl}api/groupMember/AddMemberToGroup`, requestData, {
                withCredentials: true,
            });

            if (response.data.success) {
                showToast("success", response.data.data || "Group invitation sent!");
                toggle();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || "Failed to add member.";
            showToast("error", errorMessage);
            console.error('Error add member: ', errorMessage);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Add New Member</ModalHeader>
            <ModalBody>
                <Card className="mb-3">
                    <CardBody>
                        <CardTitle tag="h6" className="mb-4">
                            Add Member to {groupName}
                        </CardTitle>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="input-studentCode">Student Code</Label>
                                <Input
                                    type="text"
                                    name="studentCode"
                                    id="input-studentCode"
                                    placeholder="Enter student code..."
                                    value={studentCode}
                                    onChange={(e) => setStudentCode(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <Button color="primary" type="submit">
                                Add Member
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddMemberFormModal;
