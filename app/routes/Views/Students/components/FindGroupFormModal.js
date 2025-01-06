import React, { useState, useEffect } from 'react';
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
import { showToast } from "./../../Utils/Toast";

const FindGroupFormModal = ({ isOpen, toggle, onGroupSaved, groupName, description, regMemberId }) => {
    const [inputDescription, setInputDescription] = useState('');

    useEffect(() => {
        if (description) {
            setInputDescription(description); 
        }
    }, [description]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            regMemberId: regMemberId,
            description: inputDescription
        };

        try {
            const response = description
                ? await axios.put(`${config.apiBaseUrl}api/reqMembers`, requestData, { withCredentials: true })
                : await axios.post(`${config.apiBaseUrl}api/reqMembers`, requestData, { withCredentials: true });

            console.log('Response:', response.data);

            if (response.data.success) {
                showToast("success", description ? "Request updated successfully!" : "Request created successfully!");
                onGroupSaved(); 
                toggle(); 
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || "Failed to save request.";
            showToast("error", errorMessage); 
            console.error('Error updating member request:', errorMessage);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                {description ? 'Edit Group Request' : 'Add New Find Member'}
            </ModalHeader>
            <ModalBody>
                <Card className="mb-3">
                    <CardBody>
                        <CardTitle tag="h6" className="mb-4">
                        Find Member to Group: {groupName}
                        </CardTitle>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="input-description">Description</Label>
                                <Input
                                    type="textarea"
                                    name="description"
                                    id="input-description"
                                    placeholder="Enter request description..."
                                    value={inputDescription}
                                    onChange={(e) => setInputDescription(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <Button color="primary" type="submit">
                                {description ? 'Update' : 'Post'}
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

export default FindGroupFormModal;
