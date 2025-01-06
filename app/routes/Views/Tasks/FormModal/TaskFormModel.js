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
    Row,  // Thêm Row
    Col
} from '../../../../components';
import axios from 'axios';
import config from '../../../../../config';
import useAuth from "../../../../../hooks/useAuth";
import { showToast } from "./../../Utils/Toast";
import { Plus, Trash2 } from 'lucide-react';

const TaskFormModel = ({ isOpen, toggle, taskData, onTaskSaved }) => {
    // Thêm styles cho progress bar
    const progressBarStyles = `
        /* Style cho progress range */
        .progress-range {
            -webkit-appearance: none;
            width: 100%;
            height: 10px;
            border-radius: 5px;
            background: #eee;
            outline: none;
            transition: all 0.2s ease;
        }

        /* Style cho track */
        .progress-range::-webkit-slider-runnable-track {
            -webkit-appearance: none;
            height: 10px;
            border-radius: 5px;
            background: linear-gradient(to right, #3B82F6 0%, #3B82F6 var(--progress-percent), #eee var(--progress-percent), #eee 100%);
        }

        /* Style cho thumb */
        .progress-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            background: #3B82F6;
            border-radius: 50%;
            cursor: pointer;
            margin-top: -5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }

        .progress-range::-webkit-slider-thumb:hover {
            background: #2563EB;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        /* Firefox styles */
        .progress-range::-moz-range-track {
            height: 10px;
            border-radius: 5px;
            background: linear-gradient(to right, #3B82F6 0%, #3B82F6 var(--progress-percent), #eee var(--progress-percent), #eee 100%);
        }

        .progress-range::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #3B82F6;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }

        .progress-range::-moz-range-thumb:hover {
            background: #2563EB;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
    `;
    const [projectId, setProjectId] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);  // Lưu danh sách thành viên nhóm
    const [selectedMembers, setSelectedMembers] = useState([]);  // Lưu các thành viên được chọn
    const { id } = useAuth();
    const [taskDetails, setTaskDetails] = useState([
        { taskDetailName: '', progressPercentage: 0 }
    ]);
    const [totalProgress, setTotalProgress] = useState(0);

    // Fetch project and group members when the component mounts
    useEffect(() => {
        const fetchProjectAndMembers = async () => {
            
            try {
                // Lấy ProjectId
                const response = await axios.get(`${config.apiBaseUrl}api/projects/getProjectId/${id}`, {
                    withCredentials: true,
                });
                if (response.data.success) {
                    setProjectId(response.data.data);  // Cập nhật giá trị projectId từ API
                }
    
                // Lấy danh sách thành viên trong nhóm của người dùng
                const membersResponse = await axios.get(`${config.apiBaseUrl}api/groupMember/MyGroup`, {
                    withCredentials: true,
                });
                setGroupMembers(membersResponse.data.data); // Lưu danh sách thành viên nhóm
            } catch (error) {
                console.error('Error fetching project or group members:', error);
            }
        };
        fetchProjectAndMembers();
    }, [id]);

    useEffect(() => {
        if (taskData) {
            setTaskStatus(taskData.status);
            setStartDate(taskData.startDate ? taskData.startDate.split('T')[0] : '');  // Chỉ lấy phần YYYY-MM-DD
            setEndDate(taskData.endDate ? taskData.endDate.split('T')[0] : ''); 
    
            if (taskData.taskAssigns) {
                const assignedMemberIds = taskData.taskAssigns.map(assign => assign.studentId);
                setSelectedMembers(assignedMemberIds);
            }
            if (taskData.taskDetails) {
                setTaskDetails(taskData.taskDetails);
            }
        } else {
            // Reset form when adding new task
            setTaskStatus('');
            setStartDate('');
            setEndDate('');
            setSelectedMembers([]);
            setTaskDetails([{ taskDetailName: '', progressPercentage: 0 }]);
        }
    }, [taskData]);

    useEffect(() => {
        const total = taskDetails.reduce((sum, detail) => sum + Number(detail.progressPercentage), 0);
        setTotalProgress(total);
    }, [taskDetails]);
    
    // Xử lý khi chọn nhiều thành viên
    const handleMemberChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedMembers(selectedOptions);  // Lưu StudentId của thành viên được chọn
    };

    const addTaskDetail = () => {
        setTaskDetails([...taskDetails, { taskDetailName: '', progressPercentage: 0 }]);
    };

    const removeTaskDetail = (index) => {
        const updatedDetails = taskDetails.filter((_, i) => i !== index);
        setTaskDetails(updatedDetails);
    };

    const handleTaskDetailChange = (index, field, value) => {
        const updatedDetails = [...taskDetails];
        if (field === 'progressPercentage') {
            // Ensure the value is between 0 and 100
            value = Math.min(Math.max(parseFloat(value) || 0, 0), 100);
        }
        updatedDetails[index] = {
            ...updatedDetails[index],
            [field]: value
        };
        setTaskDetails(updatedDetails);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const task = {
            projectId: projectId, // Sử dụng ProjectId đã lấy
            taskName: e.target.taskName.value,
            description: e.target.description.value,
            startDate: startDate,
            endDate: endDate,
            assignedMembers: selectedMembers,  // Gửi danh sách thành viên được chọn
            taskDetailsModel: taskDetails
        };

        try {
            let response;
            console.log("Submitting task:", task);
            console.log("Is update?", !!taskData);

            if(totalProgress != 100){
                showToast("error", "Total ProgressPercentage is NOT equal to 100.");
                return;
            }
            if (taskData) {
                if(taskData.status === 'Overdue'){
                    task.taskId = taskData.taskId;
                    response = await axios.put(`${config.apiBaseUrl}api/task/re-assign`, task, {
                        withCredentials: true,
                    });
                    if (response.data.success) {
                        showToast("success", "Task re-assign successfully!");
                        toggle(); // Đóng modal
                        if (onTaskSaved) {
                            onTaskSaved();
                        }
                    } else {
                        console.error("API returned error:", response.data);
                        showToast("error", response.data.errorMessage || "Failed to save task.");
                    }
                } else {
                    task.taskId = taskData.taskId;
                    response = await axios.put(`${config.apiBaseUrl}api/task/update`, task, {
                        withCredentials: true,
                    });
                    if (response.data.success) {
                        showToast("success", "Task updated successfully!");
                        toggle(); // Đóng modal
                        if (onTaskSaved) {
                            onTaskSaved();
                        }
                    } else {
                        console.error("API returned error:", response.data);
                        showToast("error", response.data.errorMessage || "Failed to save task.");
                    }
                }
                
            } else {
                response = await axios.post(`${config.apiBaseUrl}api/task/create`, task, {
                    withCredentials: true,
                });
                // Kiểm tra phản hồi từ server
                if (response.data.success) {
                    showToast("success", "Task created successfully!");
                    toggle(); // Đóng modal
                    if (onTaskSaved) {
                        onTaskSaved();
                    }
                } else {
                    console.error("API returned error:", response.data);
                    showToast("error", response.data.errorMessage || "Failed to save task.");
                }
            }

        } catch (error) {
            console.error('Error saving task:', error);
            showToast("error", "Error saving task.");
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{taskData ? (taskData.status === 'Overdue' ? 'Re-Assign' : 'Edit Task') : 'Add New Task'}</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="input-taskName">Task Name</Label>
                        <Input
                            type="text"
                            name="taskName"
                            id="input-taskName"
                            placeholder="Enter Task Name..."
                            defaultValue={taskData ? taskData.taskName : ''}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="input-description">Description</Label>
                        <Input
                            type="textarea"
                            name="description"
                            id="input-description"
                            placeholder="Enter Task Description..."
                            defaultValue={taskData ? taskData.description : ''}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="input-startDate">Start Date</Label>
                        <Input
                            type="date"
                            name="startDate"
                            id="input-startDate"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="input-endDate">End Date</Label>
                        <Input
                            type="date"
                            name="endDate"
                            id="input-endDate"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="input-members">Assign Members</Label>
                        <Input
                            type="select"
                            name="members"
                            id="input-members"
                            multiple  // Cho phép chọn nhiều thành viên
                            value={selectedMembers}  // Sử dụng value để hiển thị giá trị hiện tại
                            onChange={handleMemberChange}  // Cập nhật selectedMembers khi có thay đổi
                        >
                            {groupMembers.map(member => (
                                <option key={member.studentId} value={member.studentId}>
                                    {member.studentCode} - {member.fullName}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>

                    {/* Task Details Section */}
                    <FormGroup>
                        <Label className="d-flex justify-content-between align-items-center">
                            <span>Task Details (Total Progress: {totalProgress}%)</span>
                            <Button 
                                type="button" 
                                color="primary" 
                                size="sm" 
                                onClick={addTaskDetail}
                                className="d-flex align-items-center"
                            >
                                <Plus size={16} className="mr-1" /> Add Detail
                            </Button>
                        </Label>
                        {taskDetails.map((detail, index) => (
                            <div key={index} className="mb-3 p-3 border rounded">
                                <Row>
                                    <Col md={11}>
                                        <FormGroup>
                                            <Label>Detail Name</Label>
                                            <Input
                                                type="text"
                                                value={detail.taskDetailName}
                                                onChange={(e) => handleTaskDetailChange(index, 'taskDetailName', e.target.value)}
                                                placeholder="Enter detail name..."
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Progress Percentage: {detail.progressPercentage}%</Label>
                                            <div 
                                                style={{ 
                                                    '--progress-percent': `${detail.progressPercentage}%` 
                                                }}
                                            >
                                                <Input
                                                    type="range"
                                                    value={detail.progressPercentage}
                                                    onChange={(e) => handleTaskDetailChange(index, 'progressPercentage', e.target.value)}
                                                    min="1"
                                                    max="100"
                                                    className="progress-range"
                                                />
                                            </div>
                                            <Input
                                                type="number"
                                                value={detail.progressPercentage}
                                                onChange={(e) => handleTaskDetailChange(index, 'progressPercentage', e.target.value)}
                                                min="1"
                                                max="100"
                                                className="mt-2"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={1} className="d-flex align-items-center">
                                        {taskDetails.length > 1 && (
                                            <Button
                                                type="button"
                                                color="danger"
                                                size="sm"
                                                onClick={() => removeTaskDetail(index)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </FormGroup>
                    <Button color="primary" type="submit">
                        {taskData ? 'Update' : 'Save'}
                    </Button>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};

export default TaskFormModel;
