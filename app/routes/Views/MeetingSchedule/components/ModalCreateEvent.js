import React, { useState, useEffect, useRef } from "react";
import { 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button,
    Input,
    Label,
    Form,
    FormGroup,
    Col,
} from "../../../../components";
import { ButtonInput } from "../../../Forms/DatePicker/components";
import DatePicker, { setDefaultLocale } from 'react-datepicker';
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { showToast } from "../../Utils/Toast";
import axios from "axios";
import config from "../../../../../config";
import useAuth from "../../../../../hooks/useAuth";
import moment from 'moment';

const ModalCreateEvent = ({ isOpen, toggle, selectedEvent, setSelectedEvent, onSave }) => {
    const [errors, setErrors] = useState({});
    const { id } = useAuth();
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [duration, setDuration] = useState(() => 
        selectedEvent ? calculateDuration(selectedEvent.start, selectedEvent.end) : 0
    );

    const validateForm = () => {
        const newErrors = {};
        
        if (!selectedEvent?.name?.trim()) {
            newErrors.name = "Name is required";
        }
        if (!selectedGroup.length) {
            newErrors.group = "Group is required";
        }
        if (!selectedEvent?.start) {
            newErrors.start = "Start date is required";
        }
        if (!selectedEvent?.end) {
            newErrors.end = "End date is required";
        }
        if (!selectedEvent?.content?.trim()) {
            newErrors.content = "Content is required";
        }
        if (!selectedEvent?.location?.trim()) {
            newErrors.location = "Location is required";
        }
        if (!selectedEvent?.type || selectedEvent.type === "") {
            newErrors.type = "Meeting type is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (selectedEvent?.start && selectedEvent?.end) {
            const calculatedDuration = calculateDuration(selectedEvent.start, selectedEvent.end);
            setDuration(calculatedDuration);
        }
    }, [selectedEvent]);

    const calculateDuration = (start, end) => {
        if (!start || !end) return 0;
        const startTime = new Date(start);
        const endTime = new Date(end);
        return Math.round((endTime - startTime) / (1000 * 60));
    };

    if (!isOpen || !selectedEvent) {
        return null;
    }

    const handleDateChange = (date, type) => {
        const currentTime = new Date();
        if (date < currentTime) {
            showToast("error", "Cannot select date in past time!");
            return;
        }
        if (name === 'end' && date < editableEvent.start){
            showToast("error", "End date cannot be before start date.");
            return;
        }
        const updatedEvent = {
            ...selectedEvent,
            [type]: date,
        };
    
        onUpdateEvent(updatedEvent);
    
        if (updatedEvent.start && updatedEvent.end) {
            const calculatedDuration = calculateDuration(updatedEvent.start, updatedEvent.end);
            setDuration(calculatedDuration);
        }
    };

    const handleTimeChange = (event, type) => {
        const time = event.target.value;
        const [hours, minutes] = time.split(':').map(Number);
    
        const updatedEvent = { ...selectedEvent };
        const updatedDate = new Date(updatedEvent[type]);
        updatedDate.setHours(hours, minutes);
    
        updatedEvent[type] = updatedDate;
    
        onUpdateEvent(updatedEvent);
    
        if (updatedEvent.start && updatedEvent.end) {
            const calculatedDuration = calculateDuration(updatedEvent.start, updatedEvent.end);
            setDuration(calculatedDuration);
        }
    };

    const handleSearch = async (query) => {
        try {
            setIsLoading(true);
          const response = await axios.get(
            `${config.apiBaseUrl}api/group/search-group`,
            {
              params: { query },
              withCredentials: true
            }
          );
          if (response.data.success) {
            setOptions(response.data.data || []);
          }
        } catch (error) {
          console.error("Error fetching group suggestions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (date) => {
        const d = new Date(date);
        const hours = d.getHours().toString().padStart(2, '0'); // Lấy giờ
        const minutes = d.getMinutes().toString().padStart(2, '0'); // Lấy phút
        return `${hours}:${minutes}`;
    };

    const onUpdateEvent = (updatedEvent) => {
        setSelectedEvent(updatedEvent);
    };

    const handleCreateMeetingSchedule = async () => {
        if (!validateForm()) {
            showToast("error", "Please fill out all required fields.");
            return;
        }
        try {
            if (duration <= 0){
                showToast("error", "Duration cannot be negative or zero");
                return;
            }
            const { start, name, location, type, content, url } = selectedEvent;
            const localStartTime = moment(start).local().format('YYYY-MM-DDTHH:mm:ss');
            const requestData = {
                meetingScheduleName: name,
                meetingDate: localStartTime,
                duration: duration,
                location,
                groupId: selectedGroup[0].groupId,
                type,
                content,
                url
            };
            console.log("Request Data:", requestData);
            const response = await axios.post(
                `${config.apiBaseUrl}api/meeting-schedules/create`, requestData,
                {
                    withCredentials: true,
                }
            );
    
            if (response.data.success) {
                showToast("success", "Meeting created successfully!");
                onSave(response.data.data);
            } else {
                showToast("error", response.data.errorMessage);
            }
        } catch (error) {
            console.error("Error creating meeting:", error);
            showToast("error", "Failed to create meeting!");
        }
    };
    

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalHeader tag="h6">
                <i className="fa fa-calendar mr-2"></i> Create New Meeting
            </ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup row>
                        <Label for="inputName" sm={3}>
                            Name
                        </Label>
                        <Col sm={9}>
                            <Input 
                                type="text" 
                                name="name" 
                                id="name" 
                                placeholder="Enter name" 
                                value={selectedEvent?.name || ""}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    
                                    setSelectedEvent({ ...selectedEvent, name: newValue });
                            
                                    if (newValue.trim()) {
                                        const newErrors = { ...errors };
                                        delete newErrors.name;
                                        setErrors(newErrors);
                                    }
                                }}
                                required
                            />
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="inputGroup" sm={3}>
                            Group
                        </Label>
                        <Col sm={9}>
                            <AsyncTypeahead
                                id="select-group-typeahead"
                                isLoading={isLoading}
                                labelKey="groupName"
                                onSearch={handleSearch}
                                onFocus={() => handleSearch("")}
                                options={options}
                                minLength={0}
                                placeholder="Search for group by group name..."
                                renderMenuItemChildren={(option) => (
                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                                    <div>
                                        <div>{option.groupName} - {option.status}</div>
                                    </div>
                                    </div>
                                )}
                                onChange={(selected) => {
                                    setSelectedGroup(selected);
                            
                                    if (selected.length > 0) {
                                        setSelectedEvent({
                                            ...selectedEvent,
                                            group: selected[0].groupName,
                                        });
                            
                                        const newErrors = { ...errors };
                                        delete newErrors.group;
                                        setErrors(newErrors);
                                    }
                                }}
                                selected={selectedGroup}
                                required
                            />
                            {errors.group && <div className="text-danger">{errors.group}</div>}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="inputStartTime" sm={3}>
                            Start DateTime
                        </Label>
                        <Col sm={3}>
                            <DatePicker
                                customInput={<ButtonInput />}
                                selected={selectedEvent.start}
                                dateFormat="yyyy-MM-dd"
                                onChange={(date) => handleDateChange(date, 'start')}
                                required
                            />
                        </Col>
                        <Col sm={3}>
                            <Input
                                type="time"
                                name="time"
                                id="time"
                                value={formatTime(selectedEvent.start)}
                                required
                                onChange={(event) => handleTimeChange(event, 'start')}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="inputEndTime" sm={3}>
                            End DateTime
                        </Label>
                        <Col sm={3}>
                            <DatePicker
                                customInput={<ButtonInput />}
                                selected={selectedEvent.end}
                                dateFormat="yyyy-MM-dd"
                                onChange={(date) => handleDateChange(date, 'end')}
                                required
                            />
                        </Col>
                        <Col sm={3}>
                            <Input
                                type="time"
                                name="time"
                                id="time"
                                value={formatTime(selectedEvent.end)}
                                required
                                onChange={(event) => handleTimeChange(event, 'end')}
                            />
                        </Col>
                        <Col sm={3}>
                            <Input
                                type="number"
                                value={duration}
                                readOnly // Chỉ hiển thị, không chỉnh sửa
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="inputContent" sm={3}>
                            Content
                        </Label>
                        <Col sm={9}>
                            <Input 
                                type="textarea" 
                                name="content" 
                                id="content" 
                                placeholder="Enter content..." 
                                value={selectedEvent?.content || ""}
                                onChange={(e) => {
                                    const newValue = e.target.value;
        
                                    setSelectedEvent({ ...selectedEvent, content: newValue });
                        
                                    if (newValue.trim()) {
                                        const newErrors = { ...errors };
                                        delete newErrors.content;
                                        setErrors(newErrors);
                                    }
                                }}
                                required
                                style={{ height: "100px" }}
                            />
                            {errors.content && <div className="text-danger">{errors.content}</div>}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="inputLocation" sm={3}>
                            Location
                        </Label>
                        <Col sm={9}>
                            <Input 
                                type="text" 
                                name="location" 
                                id="location" 
                                placeholder="Enter location" 
                                value={selectedEvent?.location || ""}
                                onChange={(e) => {
                                    const newValue = e.target.value;
        
                                    setSelectedEvent({ ...selectedEvent, location: newValue });
                        
                                    if (newValue.trim()) {
                                        const newErrors = { ...errors };
                                        delete newErrors.location;
                                        setErrors(newErrors);
                                    }
                                }}
                                required
                            />
                            {errors.location && <div className="text-danger">{errors.location}</div>}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="inputUrl" sm={3}>
                            Type
                        </Label>
                        <Col sm={9}>
                            <Input 
                                type="select" 
                                name="type" 
                                id="type" 
                                value={selectedEvent?.type || ""}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                            
                                    setSelectedEvent({ ...selectedEvent, type: newValue });
                            
                                    if (newValue !== "Choose Type Meeting") {
                                        const newErrors = { ...errors };
                                        delete newErrors.type;
                                        setErrors(newErrors);
                                    } else {
                                        const newErrors = { ...errors, type: "Type is required" };
                                        setErrors(newErrors);
                                    }
                                }}
                            >
                                <option defaultValue="">Choose Type Meeting</option>
                                <option>Online</option>
                                <option>Offline</option>
                            </Input>
                            {errors.type && <div className="text-danger">{errors.type}</div>}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="inputUrl" sm={3}>
                            Url
                        </Label>
                        <Col sm={9}>
                            <Input 
                                type="text" 
                                name="url" 
                                id="url" 
                                placeholder="Enter Url" 
                                value={selectedEvent?.url || ""}
                                onChange={(e) => setSelectedEvent({ ...selectedEvent, url: e.target.value })}
                            />
                        </Col>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Close</Button>
                <Button color="primary" onClick={handleCreateMeetingSchedule}>Create</Button>
            </ModalFooter>
        </Modal>
    );
};

export default ModalCreateEvent;
