// MainTimelineFormModal.js
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
    Input,
    CustomInput
} from './../../../../components';
import axios from 'axios';
import config from '../../../../../config';
import { showToast } from './../../Notification';

const MainTimelineFormModal = ({ isOpen, toggle, onTimelineSaved }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchSubjects = async () => {
                try {
                    const response = await axios.get(`${config.apiBaseUrl}api/subject`, {
                        withCredentials: true,
                    });
                    if (response.data.success) {
                        setSubjects(response.data.data);
                    } else {
                        console.error('Error fetching subjects:', response.data.errorMessage);
                    }
                } catch (error) {
                    console.error('API error:', error);
                }
            };
            fetchSubjects();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = {
            startDate,
            endDate,
            subjectId: selectedSubject
        };
    
        try {
            const response = await axios.put(
                `${config.apiBaseUrl}api/timeline/updatemaintimeline`,
                payload, 
                { withCredentials: true } 
            );
    
            if (response.status === 200) {
                showToast('success', "Update the main timeline successfully");
                onTimelineSaved();
                toggle();
            } else {
                console.error('Failed to update main timeline');
            }
        } catch (error) {
            console.error('Error saving timeline:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Main Timeline Update</ModalHeader>
            <ModalBody>
                <p className="text-danger mb-4">
                    <strong>Note:</strong> Modifying the main timeline will automatically update specific timelines according to the main timeline.
                </p>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="subject-selector">Subject</Label>
                        <CustomInput
                            type="select"
                            id="subject-selector"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            required
                        >
                            <option value="">Select Subject...</option>
                            {subjects.map(subject => (
                                <option key={subject.subjectId} value={subject.subjectId}>
                                    {subject.subjectCode} - {subject.subjectName}
                                </option>
                            ))}
                        </CustomInput>
                    </FormGroup>
                    <FormGroup>
                        <Label for="start-date">Start Date</Label>
                        <Input
                            type="date"
                            id="start-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="end-date">End Date</Label>
                        <Input
                            type="date"
                            id="end-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </FormGroup> 
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" type="submit" onClick={handleSubmit}>Save</Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};

export default MainTimelineFormModal;
