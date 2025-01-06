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

const TopicForMentorFormModal = ({ isOpen, toggle, onGroupSaved, description, topicForMentorId, topicName }) => {
    const [inputDescription, setInputDescription] = useState(null);  // Chuyển thành null để kiểm tra file
    const [inputTopicName, setInputTopicName] = useState(topicName || '');  // Nếu có topicName thì set
    const [inputTopicForMentorId, setInputTopicForMentorId] = useState(topicForMentorId || '');  // Nếu có topicName thì set
    const [file, setFile] = useState(null);  // Thêm state cho file tải lên

    useEffect(() => {
        if (description) {
            setInputDescription(description);
        }
        if (topicName) {
            setInputTopicName(topicName);
        }
        if (topicForMentorId) { 
            setInputTopicForMentorId(topicForMentorId);
        }
    }, [description, topicName, topicForMentorId]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);  // Lưu file khi người dùng chọn
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!file) {
            showToast("error", "No file selected.");
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file); // Gửi file qua formData
        formData.append('topicName', inputTopicName); // Gửi topicName qua formData
    
        let url = `${config.apiBaseUrl}api/topicMentor`;
        let method = 'post'; // Mặc định là POST
    
        if (description) {
            // Nếu có description, chuyển sang PUT và thêm regTopicId vào query
            url += `?topicName=${inputTopicName}&TopicForMentorId=${inputTopicForMentorId}`;
            method = 'put';
        } else {
            // Nếu không có description, chỉ gửi topicName
            url += `?topicName=${inputTopicName}`;
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
                onGroupSaved(); // Load lại dữ liệu
                toggle(); // Đóng modal
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
                {description ? 'Edit Topic ' : 'Add New Topic '}
            </ModalHeader>
            <ModalBody>
                <Card className="mb-3">
                    <CardBody>
                        <CardTitle tag="h6" className="mb-4">
                            Topic Form
                        </CardTitle>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="input-topicName">Topic Name</Label>
                                <Input
                                    type="text"
                                    name="topicName"
                                    id="input-topicName"
                                    placeholder="Enter topicName..."
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

export default TopicForMentorFormModal;
