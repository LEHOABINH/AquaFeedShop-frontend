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
import { showToast } from "../../Utils/Toast";

const MyTopicFormModal = ({ isOpen, toggle, onGroupSaved, description, regTopicId, topicName }) => {
    const [inputDescription, setInputDescription] = useState(null);  
    const [inputTopicName, setInputTopicName] = useState(topicName || '');  
    const [inputRegTopicId, setInputRegTopicId] = useState(regTopicId || '');  
    const [file, setFile] = useState(null);  

    useEffect(() => {
        if (description) {
            setInputDescription(description);
        }
        if (topicName) {
            setInputTopicName(topicName);
        }
        if (regTopicId) { 
            setInputRegTopicId(regTopicId);
        }
    }, [description, topicName, regTopicId]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);  
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const trimmedTopicName = inputTopicName.trim();

        if (!file) {
            showToast("error", "No file selected.");
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file); 
        formData.append('topicName', trimmedTopicName); 
    
        let url = `${config.apiBaseUrl}api/reqTopic`;
        let method = 'post'; 
    
        if (description) {
            url += `?topicName=${trimmedTopicName}&regTopicId=${inputRegTopicId}`;
            method = 'put';
        } else {
            url += `?topicName=${trimmedTopicName}`;
        }
    
        try {
            const response = await axios({
                method,
                url,
                data: formData,
                withCredentials: true,
            });
    
            if (response.data.success) {
                showToast("success", description ? "Topic updated successfully!" : "Topic created successfully!");
                onGroupSaved(); 
                toggle(); 
            } else {
                showToast("error", response.data.errorMessage || "Có lỗi khi lưu yêu cầu.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || "Failed to save request.";
            showToast("error", errorMessage);
            console.error('Error:', error.response?.data);
        }
    };
    

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                {description ? 'Edit Topic Request' : 'Add New Topic Request'}
            </ModalHeader>
            <ModalBody>
                <Card className="mb-3">
                    <CardBody>
                        <CardTitle tag="h6" className="mb-4">
                            Topic Request Form
                        </CardTitle>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="input-topicName">Topic Name</Label>
                                <Input
                                    type="text"
                                    name="topicName"
                                    id="input-topicName"
                                    placeholder="Enter request topicName..."
                                    value={inputTopicName}
                                    onChange={(e) => setInputTopicName(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="input-description">Description (File)</Label>
                                <Input
                                    type="file"
                                    name="description"
                                    id="input-description"
                                    onChange={handleFileChange}
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

export default MyTopicFormModal;
