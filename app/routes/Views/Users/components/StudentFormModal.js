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

const StudentFormModal = ({ isOpen, toggle, studentData, onStudentSaved }) => {
    const [campuses, setCampuses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [selectedCampus, setSelectedCampus] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedLecture, setSelectedLecture] = useState('');
    const [studentCode, setStudentCode] = useState('');
    const [major, setMajor] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}api/campus`, {
                    withCredentials: true
                });
                if (response.data.success) {
                    setCampuses(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching campuses:', error);
            }
        };

        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}api/subject`, {
                    withCredentials: true
                });
                if (response.data.success) {
                    setSubjects(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        const fetchLectures = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}api/mentor/getmentorsbycampusid?campusId=${studentData.campusId}`, {
                    withCredentials: true
                });
                if (response.data.success) {
                    setLectures(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching mentors:', error);
            }
        };

        fetchCampuses();
        fetchSubjects();
        fetchLectures();
    }, []);

    useEffect(() => {
        if (studentData) {
            setLoading(true);
            const fetchStudentData = async () => {
                try {
                    const response = await axios.get(`${config.apiBaseUrl}api/students/getuserrolestudent?userId=${studentData.userId}`, {
                        withCredentials: true
                    });
                    if (response.data.success) {
                        console.log(response.data.data)
                        const student = response.data.data;
                        setSelectedCampus(student.user.campusId);
                        setSelectedSubject(student.subjectId);
                        setStudentCode(student.studentCode);
                        setMajor(student.major);
                        setSelectedLecture(student.lecturerId);
                    }
                } catch (error) {
                    console.error('Error fetching student data:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchStudentData();
        }
    }, [studentData]);

    const handleCampusChange = async (e) => {
        const campusId = e.target.value;
        setSelectedCampus(campusId);
        setSelectedLecture('');
        if (campusId) {
            try {
                const response = await axios.get(`${config.apiBaseUrl}api/mentor/getmentorsbycampusid?campusId=${campusId}`, {
                    withCredentials: true
                });
                if (response.data.success) {
                    setLectures(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching lectures:', error);
            }
        } else {
            setLectures([]);
        }
    };

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    const handleLectureChange = (e) => {
        setSelectedLecture(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const student = {
            userId: studentData ? studentData.userId : undefined,
            fullName: e.target.fullName.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            subjectId: selectedSubject,
            campusId: selectedCampus,
            studentCode,
            major,
            lectureId: selectedLecture
        };

        try {
            let response;
            if (studentData) {
                response = await axios.put(`${config.apiBaseUrl}api/students/`, student, { withCredentials: true });
            } else {
                response = await axios.post(`${config.apiBaseUrl}api/students`, student, { withCredentials: true });
            }

            if (response.data.success) {
                showToast('success', 'Student saved successfully!');
                onStudentSaved();
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
            <ModalHeader toggle={toggle}>{studentData ? 'Edit Student' : 'Add New Student'}</ModalHeader>
            <ModalBody>
                <Card className="mb-3">
                    <CardBody>
                        <CardTitle tag="h6" className="mb-4">Student Form</CardTitle>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="input-fullName">Full Name</Label>
                                <Input
                                    type="text"
                                    name="fullName"
                                    id="input-fullName"
                                    placeholder="Enter Name..."
                                    defaultValue={studentData ? studentData.fullName : ''}
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
                                    defaultValue={studentData ? studentData.email : ''}
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
                                    defaultValue={studentData ? studentData.phone : ''}
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
                            <FormGroup>
                                <Label for="subject-selector">Subject</Label>
                                <CustomInput
                                    type="select"
                                    name="subject"
                                    id="subject-selector"
                                    value={selectedSubject}
                                    onChange={handleSubjectChange}
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
                                <Label for="lecture-selector">Lecture</Label>
                                <CustomInput
                                    type="select"
                                    name="lecture"
                                    id="lecture-selector"
                                    value={selectedLecture}
                                    onChange={handleLectureChange}
                                    disabled={!selectedCampus}
                                >
                                    <option value="">Select Lecture...</option>
                                    {lectures.map(lecture => (
                                        <option key={lecture.mentorId} value={lecture.mentorId}>
                                            {lecture.user.fullName} - {lecture.specialty}
                                        </option>
                                    ))}
                                </CustomInput>
                            </FormGroup>
                            <FormGroup>
                                <Label for="input-studentCode">Student Code</Label>
                                <Input
                                    type="text"
                                    name="studentCode"
                                    id="input-studentCode"
                                    placeholder="Enter Student Code..."
                                    value={studentCode}
                                    onChange={(e) => setStudentCode(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="input-major">Major</Label>
                                <Input
                                    type="text"
                                    name="major"
                                    id="input-major"
                                    placeholder="Enter Major..."
                                    value={major}
                                    onChange={(e) => setMajor(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <Button color="primary" type="submit" disabled={loading}>
                                {studentData ? 'Update' : 'Save'}
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

export default StudentFormModal;
