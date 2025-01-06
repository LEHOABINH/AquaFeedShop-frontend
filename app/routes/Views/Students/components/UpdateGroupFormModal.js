import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Form,
    FormGroup,
    Label,
    Input
} from '../../../../components';
import axios from 'axios';
import config from '../../../../../config';
import { showToast } from "../../Utils/Toast";

const UpdateGroupFormModal = ({ isOpen, toggle, onGroupSaved, groupName: initialGroupName }) => {
    const [groupName, setGroupName] = useState(initialGroupName || '');

    useEffect(() => {
        setGroupName(initialGroupName || '');
    }, [initialGroupName]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const trimmedGroupName = groupName.trim();
        try {
            const response = await axios.put(
                `${config.apiBaseUrl}api/groupMember/UpdateGroup?groupName=${encodeURIComponent(trimmedGroupName)}`, 
                {}, 
                { withCredentials: true }
            );
    
            if (response.data.success) {
                showToast("success", "Group updated successfully!");
                onGroupSaved(groupName); 
                toggle();
            } else {
                throw new Error(response.data.errorMessage || "Unexpected error occurred.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || "Failed to save request.";
            showToast("error", errorMessage);
        }
    };
    

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Update Group Name</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="input-groupName">Group Name</Label>
                        <Input
                            type="text"
                            id="input-groupName"
                            placeholder="Enter new group name..."
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <Button color="primary" type="submit">Save</Button>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};

export default UpdateGroupFormModal;
