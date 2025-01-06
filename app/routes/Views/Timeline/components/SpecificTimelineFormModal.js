import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import config from '../../../../../config';
import { showToast } from '../../Notification';

const SpecificTimelineFormModal = ({ isOpen, toggle, selectedTimeline, onTimelineUpdated }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (selectedTimeline) {
            setStartDate(selectedTimeline.startDate.split('T')[0]);
            setEndDate(selectedTimeline.endDate.split('T')[0]);
        }
    }, [selectedTimeline]);

    const handleUpdate = async () => {
        if (new Date(endDate) < new Date(startDate)) {
            setError('End date cannot be earlier than start date.');
            return;
        }

        const updatedTimeline = {
            timelineId: selectedTimeline.timelineId,
            startDate,
            endDate,
            subjectId: selectedTimeline.subjectId,
        };

        try {
            const response = await axios.put(`${config.apiBaseUrl}api/timeline/updatespecifictimeline`, updatedTimeline, {
                withCredentials: true,
            });
            showToast('success', 'Update specific timeline successfully');
            onTimelineUpdated();
            toggle();
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data && error.response.data.errorMessage) {
                showToast('error', error.response.data.errorMessage);
            } else {
                showToast('error', "Failed to update timeline. Please try again.");
            }
        }
    };

    const handleToggle = () => {
        setError(''); 
        toggle();
    };

    return (
        <Modal isOpen={isOpen} toggle={handleToggle}>
            <ModalHeader toggle={handleToggle}>Update Timeline</ModalHeader>
            <ModalBody>
                <Form>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <FormGroup>
                        <Label for="timelineName">Timeline Name</Label>
                        <Input type="text" id="timelineName" defaultValue={selectedTimeline.timelineName} readOnly />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="textarea" id="description" defaultValue={selectedTimeline.description} readOnly />
                    </FormGroup>
                    <FormGroup>
                        <Label for="startDate">Start Date</Label>
                        <Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="endDate">End Date</Label>
                        <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleUpdate}>Update</Button>
                <Button color="secondary" onClick={handleToggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};

SpecificTimelineFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    selectedTimeline: PropTypes.object,
    onTimelineUpdated: PropTypes.func.isRequired,
};

export default SpecificTimelineFormModal;
