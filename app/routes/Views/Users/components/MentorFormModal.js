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
    Input
} from './../../../../components';
import axios from 'axios';
import config from '../../../../../config';
import { showToast } from '../../Notification';

const MentorFormModal = ({ isOpen, toggle, mentorData, onMentorSaved }) => {
    const [specialties, setSpecialties] = useState('');
    const [selectedCampus, setSelectedCampus] = useState('');
    const [mentorDetails, setMentorDetails] = useState(null);

    useEffect(() => {
        const fetchMentorDetails = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}api/mentor/getusermentor?userId=3`, { withCredentials: true });
                if (response.data && response.data.success) {
                    setMentorDetails(response.data.data);
                    setSelectedCampus(response.data.data.user.campusId || '');
                    setSpecialties(response.data.data.specialty || '');
                } else {
                    showToast('error', 'Failed to fetch mentor details.');
                }
            } catch (error) {
                console.error('Error fetching mentor details:', error);
                showToast('error', 'An unexpected error occurred while fetching mentor details.');
            }
        };

        if (isOpen) {
            fetchMentorDetails();
        }
    }, [isOpen]);

    const handleSpecialtyChange = (e) => {
        setSpecialties(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const mentor = {
            userId: mentorDetails ? mentorDetails.userId : undefined,
            fullName: e.target.fullName.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            specialty: specialties,
        };

        try {
            let response;
            if (mentorData) {
                response = await axios.put(`${config.apiBaseUrl}api/mentor/`, mentor, { withCredentials: true });
            } else {
                response = await axios.post(`${config.apiBaseUrl}api/mentor`, mentor, { withCredentials: true });
            }

            if (response.data.success) {
                showToast('success', 'Mentor saved successfully!');
                onMentorSaved();
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
            <ModalHeader toggle={toggle}>{mentorData ? 'Edit Mentor' : 'Add New Mentor'}</ModalHeader>
            <ModalBody>
                <Card className="mb-3">
                    <CardBody>
                        <CardTitle tag="h6" className="mb-4">
                            Mentor Form
                        </CardTitle>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="input-fullName">Full Name</Label>
                                <Input
                                    type="text"
                                    name="fullName"
                                    id="input-fullName"
                                    placeholder="Enter Name..."
                                    defaultValue={mentorDetails ? mentorDetails.user.fullName : ''}
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
                                    defaultValue={mentorDetails ? mentorDetails.user.email : ''}
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
                                    defaultValue={mentorDetails ? mentorDetails.user.phone : ''}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="specialty">Specialty</Label>
                                <Input
                                    type="text"
                                    name="specialty"
                                    id="specialty"
                                    placeholder="Enter Specialty..."
                                    value={specialties}
                                    onChange={handleSpecialtyChange}
                                    required
                                />
                            </FormGroup>
                            <Button color="primary" type="submit">
                                {mentorData ? 'Update' : 'Save'}
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

export default MentorFormModal;
