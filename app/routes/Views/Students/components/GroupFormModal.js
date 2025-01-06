import React, { useState, useEffect } from 'react';
import config from './../../../../../config';
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
import { showToast } from "./../../Utils/Toast"; 

const GroupFormModal = ({ isOpen, toggle, onGroupSaved }) => {
    const [groupName, setGroupName] = useState('');
    const [subjectId, setSubjectId] = useState(1);
    const [studentCodes, setStudentCodes] = useState(['']);
    const [hasMentor, setHasMentor] = useState(false);
    const [status, setStatus] = useState('Initialized');
    const [studentInfo, setStudentInfo] = useState(null);
    const [configData, setConfigData] = useState({});

    const fetchStudentInfo = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/students/byLogin`, {
                withCredentials: true,
            });
            if (response.data.success) {
                setStudentInfo(response.data.data);
                setSubjectId(response.data.data.subjectId);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || "Failed to fetch student info.";
            console.error('Error fetching student info:', errorMessage);
            showToast("error", errorMessage); 
        }
    };

    const fetchConfigSystems = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/configsystem`, {
                withCredentials: true,
            });
            if (response.data.success) {
                const configData = response.data.data;

                const maxMemberExe101 = configData.find(config => config.configName === "MAX_MEMBER_EXE101")?.number;
                const maxMemberExe201 = configData.find(config => config.configName === "MAX_MEMBER_EXE201")?.number;

                setConfigData({ maxMemberExe101, maxMemberExe201 }); 
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || "Failed to fetch student info.";
            console.error('Error fetching student info:', errorMessage);
            showToast("error", errorMessage); 
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchConfigSystems();
            fetchStudentInfo();
        }
    }, [isOpen]);

    const handleAddStudentCode = () => {
        setStudentCodes([...studentCodes, '']);
    };

    const handleStudentCodeChange = (index, value) => {
        const updatedStudentCodes = [...studentCodes];
        updatedStudentCodes[index] = value;
        setStudentCodes(updatedStudentCodes);
    };

    const handleRemoveStudentCode = (index) => {
        const updatedStudentCodes = studentCodes.filter((_, i) => i !== index);
        setStudentCodes(updatedStudentCodes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            group: {
                groupName,
                subjectId,
                hasMentor,
                status,
            },
            studentCodes: studentCodes.map(code => code.trim())
        };

        try {
            const response = await axios.post(`${config.apiBaseUrl}api/groupMember/CreateGroupWithMember`, requestData, {
                withCredentials: true,
            });
            if (response.data.success) {
                showToast("success", response.data.data.message || "Group created successfully!");
                onGroupSaved();
                toggle();
            }
            console.log('Response:', response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || "Failed to create group.";
            showToast("error", errorMessage);
            console.error('Error create group: ', errorMessage);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Add New Group</ModalHeader>
            <ModalBody>
                {studentInfo && (
                    <div style={{ marginBottom: '15px' }}>
                        <strong>Leader Info:</strong>
                        <p>Student Code: {studentInfo.studentCode}</p>
                        <p>Major: {studentInfo.major}</p>
                        <p>Subject: {studentInfo?.subject?.subjectCode}</p>
                    </div>
                )}
                <Card className="mb-3">
                    <CardBody>
                        <CardTitle tag="h6" className="mb-4">
                            Group Form
                        </CardTitle>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="input-groupName">Group Name</Label>
                                <Input
                                    type="text"
                                    name="groupName"
                                    id="input-groupName"
                                    placeholder="Enter Group Name..."
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <Label>
                                        Student Codes{" "}
                                        {subjectId === 1
                                            ? `(Limit ${configData.maxMemberExe101 - 1 || "N/A"} Student)`
                                            : subjectId === 2
                                                ? `(Limit ${configData.maxMemberExe201 - 1 || "N/A"} Student)`
                                                : ""}
                                    </Label>

                                    <Button
                                        color="primary"
                                        type="button"
                                        onClick={handleAddStudentCode}
                                        className="mt-2"
                                        disabled={
                                            (subjectId === 1 && studentCodes.length >= (configData.maxMemberExe101 - 1)) ||
                                            (subjectId === 2 && studentCodes.length >= (configData.maxMemberExe201 - 1))
                                        }
                                    >
                                        <i className="fa fa-fw fa-plus"></i>
                                    </Button>
                                </div>
                                {studentCodes.map((code, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <Input
                                            type="text"
                                            name={`studentCode-${index}`}
                                            placeholder="Enter student code"
                                            value={code}
                                            onChange={(e) => handleStudentCodeChange(index, e.target.value)}
                                            required
                                            style={{ marginRight: '10px', flexGrow: 1 }}
                                        />
                                        <Button
                                            color="danger"
                                            type="button"
                                            onClick={() => handleRemoveStudentCode(index)}
                                        >
                                            <i className="fa fa-fw fa-trash"></i>
                                        </Button>
                                    </div>
                                ))}
                            </FormGroup>

                            <Button color="primary" type="submit">
                                Save
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

export default GroupFormModal;
