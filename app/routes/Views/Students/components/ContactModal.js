import React, { useState, useEffect } from 'react'; 
import { useHistory } from 'react-router-dom';
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
import { showToast } from "./../../Utils/Toast"; // Nhập showToast
import useAuth from "../../../../../hooks/useAuth";

const ContactModal = ({ isOpen, toggle, contactedUserId, closeParentModal}) => {
    const [inputMessage, setInputMessage] = useState('');
    const { id } = useAuth();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            contactedUserId: contactedUserId,
            contactUserId: id,
            message: inputMessage
        };

        try {
            const response = await axios.post(`${config.apiBaseUrl}api/chat-groups/personal/contact`, requestData, { withCredentials: true });

            console.log('Response:', response.data);

            if (response.data.success) {
                showToast("success", response.data.data);
                history.push('/Views/Chat');
                closeParentModal();
            }
            else{
                showToast("error", response.data.errorMessage);
            }
        } catch (error) {
            console.error('Error when send message:', error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                Contact
            </ModalHeader>
            <ModalBody>
                <Card className="mb-3">
                    <CardBody>
                        <CardTitle tag="h6" className="mb-4">
                            Send a message to start contacting
                        </CardTitle>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Input
                                    type="text"
                                    name="description"
                                    id="input-description"
                                    placeholder="Enter your message here..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <Button color="primary" type="submit">
                                Send
                            </Button>
                            <Button color="ml-2 secondary" onClick={toggle}>Cancel</Button>
                        </Form>
                    </CardBody>
                </Card>
            </ModalBody>
        </Modal>
    );
};

export default ContactModal;
