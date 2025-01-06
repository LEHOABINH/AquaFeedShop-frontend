import React, { useState, useEffect } from 'react';
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
    Input,
    CustomInput
} from './../../../../components';
import axios from 'axios';
import config from '../../../../../config';
import { showToast } from '../../Notification';

const UserFormModal = ({ isOpen, toggle, userData, onUserSaved }) => {
    const [campuses, setCampuses] = useState([]);
    const [selectedCampus, setSelectedCampus] = useState('');

    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}api/campus`,{
                    withCredentials: true
                });
                if (response.data.success) {
                    setCampuses(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching campuses:', error);
            }
        };

        fetchCampuses();
    }, []);

    useEffect(() => {
        if (userData) {
            setSelectedCampus(userData.campus.campusId); 
        }
    }, [userData]);

    const handleCampusChange = (e) => {
        setSelectedCampus(e.target.value);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
        userId: userData ? userData.userId : undefined,
        fullName: e.target.fullName.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        campusId: selectedCampus,
        roleId: 2,
    };

    try {
        let response;
        
        if (userData) {
            response = await axios.put(`${config.apiBaseUrl}api/user/`, user, { withCredentials: true });
        } else {
            response = await axios.post(`${config.apiBaseUrl}api/user`, user, { withCredentials: true });
        }

        if (response.data) {
            showToast('success', 'User saved successfully!');
            onUserSaved(); 
            toggle(); 
        }
    } catch (error) {
        if (error.response && error.response.status === 409) {  
            const message = error.response.data || 'A conflict error occurred';
            showToast('error', message);
        } else {
            console.error('An error occurred:', error.message);
        }
    }
};


    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{userData ? 'Edit User' : 'Add New User'}</ModalHeader>
            <ModalBody>
                <Card className="mb-3">
                    <CardBody>
                        <CardTitle tag="h6" className="mb-4">
                            User Form
                        </CardTitle>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="input-fullName">Full Name</Label>
                                <Input
                                    type="text"
                                    name="fullName"
                                    id="input-fullName"
                                    placeholder="Enter Name..."
                                    defaultValue={userData ? userData.fullName : ''}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="input-email">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="input-email"
                                    placeholder="Enter Email..."
                                    defaultValue={userData ? userData.email : ''}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="input-phone">Phone</Label>
                                <Input
                                    type="number"
                                    name="phone"
                                    id="input-phone"
                                    placeholder="Enter Phone..."
                                    defaultValue={userData ? userData.phone : ''}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="campus-selector">Campus</Label>
                                <CustomInput
                                    type="select"
                                    name="campus"
                                    id="campus-selector"
                                    value={selectedCampus}
                                    onChange={handleCampusChange}
                                >
                                    <option value="">Select Campus...</option>
                                    {campuses.map(campus => (
                                        <option key={campus.campusId} value={campus.campusId}>
                                            {campus.campusName}
                                        </option>
                                    ))}
                                </CustomInput>
                            </FormGroup>
                            <Button color="primary" type="submit">
                                {userData ? 'Update' : 'Save'}
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

export default UserFormModal;
