import React, { useState, useEffect} from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Table, Button, Form, FormGroup, Col, Label, Input } from "../../../../components";
import DatePicker, { setDefaultLocale } from 'react-datepicker';
import { ButtonInput } from "../../../Forms/DatePicker/components";
import { showToast } from "../../Utils/Toast";
import axios from "axios";
import config from "../../../../../config";
import moment from 'moment';
import ConfirmDeleteModal from "./ModalDeleteEvent";
import useAuth from "../../../../../hooks/useAuth";

const ModalEventDetails = ({ isOpen, toggle, event, onSave, onDelete}) => {
    const [errors, setErrors] = useState({});
    const { role, hasPermission } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editableEvent, setEditableEvent] = useState(event || {});
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

    const toggleConfirmDeleteModal = () => {
        setIsConfirmDeleteModalOpen(!isConfirmDeleteModalOpen);
    };

    useEffect(() => {
        if (event) {
            setEditableEvent({
                ...event,
                start: event.start ? new Date(event.start) : new Date(),
                end: event.end ? new Date(event.end) : new Date(),
            });
        }
    }, [event]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!editableEvent?.name?.trim()) {
            newErrors.name = "Name is required.";
        }
        if (!editableEvent?.content?.trim()) {
            newErrors.content = "Content is required.";
        }
        if (!editableEvent?.location?.trim()) {
            newErrors.location = "Location is required.";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "start" || name === "end") {
            const [hours, minutes] = value.split(":").map(Number);
            setEditableEvent((prev) => {
                const updatedDate = new Date(prev[name]);
                updatedDate.setHours(hours, minutes);
                return {
                    ...prev,
                    [name]: updatedDate,
                };
            });
        } else {
            setEditableEvent((prev) => ({
                ...prev,
                [name]: value,
            }));
            if (value.trim() && errors[name]) {
                setErrors((prevErrors) => {
                    const { [name]: removedError, ...rest } = prevErrors;
                    return rest;
                });
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditableEvent(event);
    };

    const handleDateChange = (name, date) => {
        const currentTime = new Date();
        if (date < currentTime) {
            showToast("error", "Cannot select date in past time!");
            return;
        }
        if (name === 'end' && date < editableEvent.start){
            showToast("error", "End date cannot be before start date.");
            return;
        }
        setEditableEvent((prev) => ({
            ...prev,
            [name]: date,
        }));
    };

    const handleSave = async () => {
        if (!validateForm()) {
            showToast("error", "Please correct the errors in the form.");
            return;
        }
        try {
            const localStartTime = moment(editableEvent.start).local().format('YYYY-MM-DDTHH:mm:ss');
            if (editableEvent.type === "Offline") editableEvent.url = null;
            const requestData = {
                meetingScheduleName: editableEvent.name,
                meetingDate: localStartTime,
                duration: duration,
                location: editableEvent.location,
                type: editableEvent.type,
                content: editableEvent.content,
                url: editableEvent.url
            };
            if (duration <= 0){
                showToast("error", "Duration cannot be negative or zero");
                return;
            }
            console.log("editableEvent", editableEvent);
            const response = await axios.post(
                `${config.apiBaseUrl}api/meeting-schedules/edit/${editableEvent.id}`, requestData,
                {
                    withCredentials: true,
                }
            );
    
            if (response.data.success) {
                showToast("success", response.data.data);
                onSave(editableEvent);
                setIsEditing(false);
            } else {
                showToast("error", response.data.errorMessage);
            }
        } catch (error) {
            console.error("Error creating meeting:", error);
            showToast("error", "Failed to create meeting!");
        }
    };

    const handleDeleteEvent = async () => {
        try {
          const response = await axios.delete(
            `${config.apiBaseUrl}api/meeting-schedules/delete/${editableEvent.id}`,
            { withCredentials: true }
          );
    
          if (response.data.success) {
            showToast("success", "Meeting deleted successfully!");
            onDelete(editableEvent.id);
          } else {
            showToast("error", response.data.errorMessage);
          }
        } catch (error) {
          console.error("Error deleting event:", error);
          showToast("error", "Failed to delete event!");
        }
        setIsConfirmDeleteModalOpen(false); // Đóng modal xác nhận sau khi thực hiện xóa
      };

    const [duration, setDuration] = useState(() => 
        event ? calculateDuration(event.start, event.end) : 0
    );

    useEffect(() => {
        if (editableEvent.start && editableEvent.end) {
            setDuration(calculateDuration(editableEvent.start, editableEvent.end));
        }
    }, [editableEvent.start, editableEvent.end]);

    const calculateDuration = (start, end) => {
        if (!start || !end) return 0;
        const startTime = new Date(start);
        const endTime = new Date(end);
        return Math.round((endTime - startTime) / (1000 * 60));
    };
    if (!isOpen || !event) return null;

    const renderField = (label, name, value) => (
        <FormGroup row>
            <Label for={name} sm={3}>
                {label}
            </Label>
            <Col sm={9}>
                {isEditing ? (
                    <>
                        <Input
                            type="text"
                            name={name}
                            id={name}
                            value={value}
                            onChange={handleInputChange}
                        />
                        {errors[name] && <div className="text-danger mt-1">{errors[name]}</div>}
                    </>
                ) : (
                    <Input type="text" value={value} plaintext readOnly />
                )}
            </Col>
        </FormGroup>
    );

    const formatTime = (date) => {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d)) return "";
        const hours = d.getHours().toString().padStart(2, '0'); 
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <>
            <Modal isOpen={isOpen} toggle={toggle} size="lg">
                <ModalHeader>
                    Event Details
                    <div className="ml-auto">
                            <>
                                {isEditing ? (
                                    <>
                                        <Button color="success" size="sm" onClick={handleSave}>
                                            Save
                                        </Button>
                                        <Button
                                            color="secondary"
                                            size="sm"
                                            className="ml-2"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {hasPermission("edit_meeting_schedule") && (
                                            <Button
                                                color="primary"
                                                size="sm"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                        {hasPermission("delete_meeting_schedule") && (
                                        <Button
                                            color="danger"
                                            size="sm"
                                            className="ml-2"
                                            onClick={toggleConfirmDeleteModal}
                                            >
                                            Delete
                                        </Button>
                                        )}
                                    </>
                                )}
                            </>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Form>
                        {renderField("Name", "name", editableEvent.name)}
                        <FormGroup row>
                            <Label for="mentor" sm={3}>Mentor</Label>
                            <Col sm={9}>
                                <Input type="text" value={editableEvent.mentor} plaintext readOnly />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="group" sm={3}>Group</Label>
                            <Col sm={9}>
                                <Input type="text" value={editableEvent.group} plaintext readOnly />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="topic" sm={3}>Topic</Label>
                            <Col sm={9}>
                                <Input type="text" value={editableEvent.topic} plaintext readOnly />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="inputStartTime" sm={3}>
                                Start DateTime
                            </Label>
                            <Col sm={3}>
                                {isEditing ? (
                                    <DatePicker
                                        customInput={<ButtonInput />}
                                        selected={editableEvent.start ? new Date(editableEvent.start) : null}
                                        dateFormat="yyyy-MM-dd"
                                        required
                                        onChange={(date) => handleDateChange("start", date)}
                                    />
                                ) : (
                                    <DatePicker
                                        customInput={<ButtonInput />}
                                        selected={new Date(editableEvent.start)}
                                        dateFormat="yyyy-MM-dd"
                                        required
                                        readOnly
                                        onFocus={(e) => e.preventDefault()}
                                    />
                                )}
                            </Col>
                            <Col sm={3}>
                                <Input
                                    type="time"
                                    name="startTime"
                                    id="startTime"
                                    value={formatTime(editableEvent.start)}
                                    required
                                    readOnly={!isEditing}
                                    onChange={(e) => handleInputChange({ target: { name: "start", value: e.target.value } })}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label for="inputEndTime" sm={3}>
                                End DateTime / Duration
                            </Label>
                            <Col sm={3}>
                                {isEditing ? (
                                    <DatePicker
                                        customInput={<ButtonInput />}
                                        selected={new Date(editableEvent.end)}
                                        dateFormat="yyyy-MM-dd"
                                        required
                                        onChange={(date) => handleDateChange("end", date)}
                                    />
                                ) : (
                                    <DatePicker
                                        customInput={<ButtonInput />}
                                        selected={new Date(editableEvent.end)}
                                        dateFormat="yyyy-MM-dd"
                                        required
                                        readOnly
                                        onFocus={(e) => e.preventDefault()}
                                    />
                                )}
                            </Col>
                            <Col sm={3}>
                                <Input
                                    type="time"
                                    name="endTime"
                                    id="endTime"
                                    value={formatTime(editableEvent.end)}
                                    required
                                    readOnly={!isEditing}
                                    onChange={(e) => handleInputChange({ target: { name: "end", value: e.target.value } })}
                                />
                            </Col>
                            <Col sm={3}>
                                <Input
                                    type="number"
                                    value={duration}
                                    readOnly
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="content" sm={3}>
                                Content
                            </Label>
                            <Col sm={9}>
                                {isEditing ? (
                                    <>
                                        <Input 
                                        type="textarea" 
                                        name="content" 
                                        id="content" 
                                        placeholder="Enter content..." 
                                        value={editableEvent.content}
                                        onChange={handleInputChange}
                                        style={{ height: "100px" }}
                                        />
                                        {errors.content && <div className="text-danger mt-1">{errors.content}</div>}
                                    </>
                                ) : (
                                    <Input style={{ height: "100px"}} type="textarea" value={editableEvent.content} readOnly />
                                )}
                            </Col>
                        </FormGroup>
                        {renderField("Location", "location", editableEvent.location)}
                        <FormGroup row>
                            <Label for="type" sm={3}>
                                Type
                            </Label>
                            <Col sm={9}>
                                {isEditing ? (
                                    <Input
                                        type="select"
                                        name="type"
                                        id="type"
                                        value={editableEvent.type}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Online">Online</option>
                                        <option value="Offline">Offline</option>
                                    </Input>
                                ) : (
                                    <Input type="text" value={editableEvent.type} plaintext readOnly />
                                )}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="url" sm={3}>
                                Url
                            </Label>
                            <Col sm={9}>
                                {isEditing ? (
                                    <Input
                                        type="text"
                                        name="url"
                                        id="url"
                                        value={editableEvent.url}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    editableEvent.url ? (
                                        <a
                                            href={editableEvent.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "#1EB7FF" }}
                                        >
                                            Open Link
                                        </a>
                                    ) : (
                                        <span>No</span> // Nếu url là null, hiển thị "No"
                                    )
                                )}
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                <Button color="secondary" onClick={() => { setIsEditing(false); toggle(); }}>
                    Close
                </Button>            
                </ModalFooter>
            </Modal>

            <ConfirmDeleteModal
            isOpen={isConfirmDeleteModalOpen}
            toggle={toggleConfirmDeleteModal}
            onDelete={handleDeleteEvent}
            itemName={editableEvent.name}
            />
        </>
    );
};

export default ModalEventDetails;
