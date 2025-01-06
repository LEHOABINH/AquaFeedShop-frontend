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

const WorkshopFormModal = ({ isOpen, toggle, workshopData, onWorkshopSaved }) => {
    const [workshopName, setWorkshopName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [regUrl, setRegUrl] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (workshopData) {
            setWorkshopName(workshopData.name);
            setDescription(workshopData.description);
            setStartDate(workshopData.startDate.split('T')[0]); 
            setEndDate(workshopData.endDate.split('T')[0]); 
            setStartTime(workshopData.startDate.split('T')[1].substring(0, 5)); 
            setEndTime(workshopData.endDate.split('T')[1].substring(0, 5)); 
            setLocation(workshopData.location);
            setRegUrl(workshopData.regUrl);
            setStatus(workshopData.status);
        }
    }, [workshopData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fullStartDate = `${startDate}T${startTime}:00`;
        const fullEndDate = `${startDate}T${endTime}:00`;

        const workshop = {
            workshopId: workshopData?.workshopId,
            name: workshopName,
            description,
            startDate: fullStartDate,
            endDate: fullEndDate,
            location,
            regUrl,
            status
        };

        try {
            if (workshopData) {
                await axios.put(`${config.apiBaseUrl}api/workshop/`, workshop,{
                    withCredentials: true,
                });
                showToast('success', 'Workshop updated successfully');
            } else {
                await axios.post(`${config.apiBaseUrl}api/workshop`, workshop,{
                    withCredentials: true,
                });
                showToast('success', 'Workshop created successfully');
            }
            onWorkshopSaved();
            toggle();
        } catch (error) {
            console.error('Error saving workshop:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{workshopData ? 'Edit Workshop' : 'Add New Workshop'}</ModalHeader>
            <ModalBody>
                <Card className="mb-3">
                    <CardBody>
                        <CardTitle tag="h6" className="mb-4">
                            Workshop Form
                        </CardTitle>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="workshop-name">Workshop Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="workshop-name"
                                    placeholder="Enter Workshop Name..."
                                    value={workshopName}
                                    onChange={(e) => setWorkshopName(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="workshop-description">Description</Label>
                                <Input
                                    type="textarea"
                                    name="description"
                                    id="workshop-description"
                                    placeholder="Enter Workshop Description..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="start-date">Start Date</Label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    id="start-date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="start-time">Start Time</Label>
                                <Input
                                    type="time"
                                    name="startTime"
                                    id="start-time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="end-time">End Time</Label>
                                <Input
                                    type="time"
                                    name="endTime"
                                    id="end-time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="workshop-location">Location</Label>
                                <Input
                                    type="text"
                                    name="location"
                                    id="workshop-location"
                                    placeholder="Enter Location..."
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="registration-url">Registration URL</Label>
                                <Input
                                    type="text"
                                    name="regUrl"
                                    id="registration-url"
                                    placeholder="Enter Registration URL..."
                                    value={regUrl}
                                    onChange={(e) => setRegUrl(e.target.value)}
                                />
                            </FormGroup>
                            <Button color="primary" type="submit">
                                {workshopData ? 'Update' : 'Save'}
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

export default WorkshopFormModal;
