import React, { useState, useEffect } from 'react';
import { faker } from "@faker-js/faker";
import { Link } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import axios from 'axios';
import config from '../../../../config';

import {
    Container,
    Row,
    Card,
    CardBody,
    Badge,
    Table,
    CardTitle,
    Button,
    InputGroup,
    InputGroupAddon,
    Input,
    ListGroup,
    ListGroupItem,
    Media,
    Col,
} from "../../../components";
import { setupPage } from "../../../components/Layout/setupPage";

import { HeaderMain } from "../../components/HeaderMain";

import { TasksMedia } from "./components/TasksMedia";
import { TinyDonutChart } from "./components/TinyDonutChart";
import { TinyDonutChartAllProjects } from "./components/TinyDonutChartAllProjects";
import { CampusMini } from "./components/CampusMini";
import { DraggableProjects } from "./components/DraggableProjects";

const ManagerDashboard = () => {
    const { id } = useAuth();
    const [dataDashboard, setDataDashboard] = useState({
        groups: [],
        projects: [],
        regTopics: [],
    });
    const [students, setStudents] = useState([]);
    const [groupSubjects, setGroupSubjects] = useState([]);
    const [groups, setGroups] = useState([]);
    const [projects, setProjects] = useState([]);
    const [dashboard, setDashboard] = useState([]);

    const fetchDashboard = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/dashboard/mentor`, {
                withCredentials: true,
            });

            if (response.data.success) {
                setDataDashboard(response.data.data);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const fetchDashboardManager = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/dashboard/manager`, {
                withCredentials: true,
            });

            if (response.data.success) {
                setDashboard(response.data.data);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const fetchStudents = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/students`, {
                withCredentials: true,
            });

            if (response.data.success) {
                setStudents(response.data.data);
            } else {
                console.error('Failed to fetch students data');
            }
        } catch (error) {
            console.error('Error fetching students data:', error);
        }
    };
    const fetchGroupSubjects = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/group/group-subject`, {
                withCredentials: true,
            });

            if (response.data.success) {
                setGroupSubjects(response.data.data);
            } else {
                console.error('Failed to fetch group subjects');
            }
        } catch (error) {
            console.error('Error fetching group subjects:', error);
        }
    };
    const fetchGroups = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/group`, {
                withCredentials: true,
            });


            if (response.data.success) {
                setGroups(response.data.data);
            } else {
                console.error('Failed to fetch group');
            }
        } catch (error) {
            console.error('Error fetching groups data:', error);
        }
    };
    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/projects`, {
                withCredentials: true,
            });

            if (response.data.success) {
                setProjects(response.data.data);
            } else {
                console.error('Failed to fetch projects');
            }
        } catch (error) {
            console.error('Error fetching projects data:', error);
        }
    };



    useEffect(() => {
        fetchDashboard();
        fetchStudents();
        fetchGroupSubjects();
        fetchGroups();
        fetchProjects();
        fetchDashboardManager();
    }, [id]);


    const getTotalMembers = () => {
        return dataDashboard.groups.reduce((total, group) => {
            return total + (group.groupMembers ? group.groupMembers.length : 0);
        }, 0);
    };

    return (
        <Container>
            <Row className="mb-5">
                <Col lg={12}>
                    <HeaderMain title="Dashboard" className="mb-4 mb-lg-5" />
                </Col>
                <Col lg={3}>
                    <div className="hr-text hr-text-center my-2">
                        <span>EXE101</span>
                    </div>
                    <Row>
                        <Col xs={6} className="text-center">
                            <p className="text-center mb-0">
                                <i className="fa fa-circle text-primary mr-2"></i>
                                Groups
                            </p>
                            <h4 className="mt-2 mb-0">
                                {groupSubjects?.filter(subject => subject.subjectCode === 'EXE101').length || 0}
                            </h4>
                        </Col>
                        <Col xs={6} className="text-center">
                            <p className="text-center mb-0">
                                <i className="fa fa-circle text-info mr-2"></i>
                                Students
                            </p>
                            <h4 className="mt-2 mb-0">
                                {students?.filter(student => student?.subjectId === 1).length || 0}
                            </h4>
                        </Col>
                    </Row>
                    <div className="hr-text hr-text-center mb-2" style={{ marginTop: '41px' }}>
                        <span>EXE201</span>
                    </div>

                    <Row className="mb-4 mb-xl-0">
                        <Col xs={6} className="text-center">
                            <p className="text-center mb-0">
                                <i className="fa fa-circle text-warning mr-2"></i>
                                Groups
                            </p>
                            <h4 className="mt-2 mb-0">{groupSubjects?.filter(subject => subject.subjectCode === 'EXE201').length || 0}</h4>
                        </Col>
                        <Col xs={6} className="text-center">
                            <p className="text-center mb-0">
                                <i className="fa fa-circle text-danger mr-2"></i>
                                Students
                            </p>
                            <h4 className="mt-2 mb-0">
                                {students?.filter(student => student?.subjectId === 2).length || 0}
                            </h4>
                        </Col>
                    </Row>
                    {/* <div className="hr-text hr-text-center mb-2" style={{ marginTop: '41px' }}>
                        <span>EXE201</span>
                    </div>

                    <Row className="mb-4 mb-xl-0">
                        <Col xs={6} className="text-center">
                            <p className="text-center mb-0">
                                <i className="fa fa-circle text-warning mr-2"></i>
                                Groups
                            </p>
                            <h4 className="mt-2 mb-0">{groupSubjects?.filter(subject => subject.subjectCode === 'EXE201').length || 0}</h4>
                        </Col>
                        <Col xs={6} className="text-center">
                            <p className="text-center mb-0">
                                <i className="fa fa-circle text-danger mr-2"></i>
                                Students
                            </p>
                            <h4 className="mt-2 mb-0">
                                {students?.filter(student => student?.subjectId === 2).length || 0}
                            </h4>
                        </Col>
                    </Row> */}
                </Col>
                <Col lg={3} >
                    <div className="hr-text hr-text-left my-2">
                        <span>Groups</span>
                    </div>
                    <Row>
                        <Media>
                            <Media left className="mr-3">
                                <TinyDonutChart
                                    groups={groups}
                                    type="group1"
                                />
                            </Media>
                            <Media body>
                                <div>
                                    <i className="fa fa-circle mr-1 text-yellow"></i>
                                    <span className="text-inverse">
                                        {groups?.filter(group => group?.subjectId === 1 && group?.status == "Initialized").length || 0}
                                    </span> Initialized
                                </div>
                                <div>
                                    <i className="fa fa-circle mr-1 text-blue"></i>
                                    <span className="text-inverse">
                                        {groups?.filter(group => group?.subjectId === 1 && group?.status == "Eligible").length || 0}
                                    </span> Eligible
                                </div>
                                <div>
                                    <i className="fa fa-circle mr-1 text-success"></i>
                                    <span className="text-inverse">
                                        {groups?.filter(group => group?.subjectId === 1 && group?.status == "Approved").length || 0}
                                    </span> Approved
                                </div>
                            </Media>
                        </Media>
                    </Row>
                    <div className="hr-text hr-text-left my-2">
                        <span>Groups</span>
                    </div>
                    <Row>
                        <Media>
                            <Media left className="mr-3">
                                <TinyDonutChart
                                    groups={groups}
                                    type="group2"
                                />
                            </Media>
                            <Media body>
                                <div>
                                    <i className="fa fa-circle mr-1 text-yellow"></i>
                                    <span className="text-inverse">
                                        {groups?.filter(group => group?.subjectId === 2 && group?.status == "Initialized").length || 0}
                                    </span> Initialized
                                </div>
                                <div>
                                    <i className="fa fa-circle mr-1 text-blue"></i>
                                    <span className="text-inverse">
                                        {groups?.filter(group => group?.subjectId === 2 && group?.status == "Eligible").length || 0}
                                    </span> Eligible
                                </div>
                                <div>
                                    <i className="fa fa-circle mr-1 text-success"></i>
                                    <span className="text-inverse">
                                        {groups?.filter(group => group?.subjectId === 2 && group?.status == "Approved").length || 0}
                                    </span> Approved
                                </div>
                            </Media>
                        </Media>
                    </Row>
                </Col>
                <Col lg={3} >
                    <div className="hr-text hr-text-left my-2">
                        <span>Projects</span>
                    </div>
                    <Row>
                        <Media>
                            <Media left className="mr-3">
                                <TinyDonutChart
                                    projects={projects}
                                    type="projectManager1"
                                />
                            </Media>
                            <Media body>
                                <div>
                                    <i className="fa fa-circle mr-1 text-yellow"></i>
                                    <span className="text-inverse">
                                        {projects?.filter(project => project?.subjectId === 1 && project?.status == "In_Progress").length || 0}
                                    </span> In Progress
                                </div>
                                <div>
                                    <i className="fa fa-circle mr-1 text-success"></i>
                                    <span className="text-inverse">
                                        {projects?.filter(project => project?.subjectId === 1 && project?.status == "Completed").length || 0}
                                    </span> Completed
                                </div>
                            </Media>
                        </Media>
                    </Row>
                    <div className="hr-text hr-text-center mb-2" style={{ marginTop: '18px' }} >
                        <span>Projects</span>
                    </div>
                    <Row>
                        <Media>
                            <Media left className="mr-3">
                                <TinyDonutChart
                                    projects={projects}
                                    type="projectManager2"
                                />
                            </Media>
                            <Media body>
                                <div>
                                    <i className="fa fa-circle mr-1 text-yellow"></i>
                                    <span className="text-inverse">
                                        {projects?.filter(project => project?.subjectId === 2 && project?.status == "In_Progress").length || 0}
                                    </span> In Progress
                                </div>
                                <div>
                                    <i className="fa fa-circle mr-1 text-success"></i>
                                    <span className="text-inverse">
                                        {projects?.filter(project => project?.subjectId === 2 && project?.status == "Completed").length || 0}
                                    </span> Completed
                                </div>
                            </Media>
                        </Media>
                    </Row>
                </Col>
                <Col lg={3}>
                    <div className="hr-text hr-text-left my-2">
                        <span>Students</span>
                    </div>
                    <Table size="sm">
                        <tbody>
                            <tr>
                                <td className="text-inverse bt-0">Software Engineering</td>
                                <td className="text-right bt-0">
                                    <Badge color="success" pill>
                                        {students?.filter(student => student?.studentCode?.includes('SE')).length || 0}
                                    </Badge>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-inverse">International Business</td>
                                <td className="text-right">
                                    <Badge color="primary" pill>
                                        {students?.filter(student => student?.studentCode?.includes('IB')).length || 0}
                                    </Badge>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-inverse">Artificial Intelligence</td>
                                <td className="text-right">
                                    <Badge color="info" pill>
                                        {students?.filter(student => student?.studentCode?.includes('AI')).length || 0}
                                    </Badge>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-inverse">Graphic Design</td>
                                <td className="text-right">
                                    <Badge color="secondary" pill>
                                        {students?.filter(student => student?.studentCode?.includes('GD')).length || 0}
                                    </Badge>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-inverse">Digital Marketing</td>
                                <td className="text-right">
                                    <Badge color="success" pill>
                                        {students?.filter(student => student?.studentCode?.includes('SS')).length || 0}
                                    </Badge>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>

                <Col lg={6}>
                    <Card className="mb-3">
                        <CardBody>
                            <CardTitle tag="h6">User</CardTitle>
                            {(() => {
                                // Dữ liệu tổng hợp theo campus
                                const campuses = [
                                    {
                                        title: "FPT Ho Chi Minh",
                                        userCount: dashboard.userHCM,
                                        studentCount: dashboard.studentHCM,
                                        mentorCount: dashboard.mentorHCM,
                                    },
                                    {
                                        title: "FPT Ha Noi",
                                        userCount: dashboard.userHN,
                                        studentCount: dashboard.studentHN,
                                        mentorCount: dashboard.mentorHN,
                                    },
                                    {
                                        title: "FPT Da Nang",
                                        userCount: dashboard.userHD,
                                        studentCount: dashboard.studentHD,
                                        mentorCount: dashboard.mentorHD,
                                    },
                                ];

                                // Render mỗi CampusMini
                                return campuses.map((campus) => (
                                    <CampusMini
                                        key={campus.title}
                                        groupName={campus.title}
                                        userCount={campus.userCount}
                                        studentCount={campus.studentCount}
                                        mentorCount={campus.mentorCount}
                                        icon="university"
                                        iconClassName="text-success"
                                        badgeTitle={campus.title}
                                        badgeColor="success"
                                    />
                                ));
                            })()}
                        </CardBody>
                    </Card>
                </Col>
                {/* <Col lg={6}>
                    <Card className="mb-3">
                        <CardBody>
                            <CardTitle tag="h6" className="mb-3">
                                Projects
                            </CardTitle>
                            <InputGroup>
                                <Input placeholder="Search Projects..." />
                                <InputGroupAddon addonType="append">
                                    <Button
                                        color="secondary"
                                        outline
                                        tag={Link}
                                        to="/apps/projects/list"
                                    >
                                        <i className="fa fa-search"></i>
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </CardBody>
                        <DraggableProjects dataProjectsDashboard={dataDashboard.projects} />
                    </Card>
                </Col> */}
            </Row>
        </Container>
    );
};

export default setupPage({
    pageTitle: "Projects Dashboard",
})(ManagerDashboard);
