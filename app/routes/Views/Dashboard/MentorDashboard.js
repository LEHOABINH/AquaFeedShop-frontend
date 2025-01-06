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
} from "./../../../components";
import { setupPage } from "./../../../components/Layout/setupPage";

import { HeaderMain } from "../../components/HeaderMain";

import { TasksMedia } from "./components/TasksMedia";
import { TinyDonutChart } from "./components/TinyDonutChart";
import { TinyDonutChartAllProjects } from "./components/TinyDonutChartAllProjects";
import { TimelineMini } from "./components/TimelineMini";
import { DraggableProjects } from "./components/DraggableProjects";

const MentorDashboard = () => {
    const { id } = useAuth();
    const [dataDashboard, setDataDashboard] = useState({
        groups: [],
        projects: [],
        regTopics: [],
    });
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

    useEffect(() => {
        fetchDashboard();
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
        <Col lg={4}>
            <div className="hr-text hr-text-center my-2">
            <span>Group Members</span>
            </div>
            <Row>
            <Col xs={6} className="text-center">
                <p className="text-center mb-0">
                <i className="fa fa-circle text-primary mr-2"></i>
                Groups
                </p>
                <h4 className="mt-2 mb-0">{dataDashboard?.groups?.length || 0}</h4>
            </Col>
            <Col xs={6} className="text-center">
                <p className="text-center mb-0">
                <i className="fa fa-circle text-info mr-2"></i>
                Students
                </p>
                <h4 className="mt-2 mb-0">{getTotalMembers()}</h4>
            </Col>
            </Row>
        </Col>
        <Col lg={4} md={6}>
            <div className="hr-text hr-text-left my-2">
            <span>Topic Registration</span>
            </div>
            <Media>
            <Media left className="mr-3">
                <TinyDonutChart 
                    dataDashboard = {dataDashboard}
                    type = "topic"
                />
            </Media>
            <Media body>
                <div>
                    <i className="fa fa-circle mr-1 text-yellow"></i>
                    <span className="text-inverse">
                        {dataDashboard?.regTopics.filter(topic => topic?.status === true).length || 0}
                    </span> Pending
                </div>
                <div>
                    <i className="fa fa-circle mr-1 text-danger"></i>
                    <span className="text-inverse">
                        {dataDashboard?.regTopics.filter(topic => topic?.status === false).length || 0}
                    </span> Rejected
                </div>
                <div>
                    <i className="fa fa-circle mr-1 text-success"></i>
                    <span className="text-inverse">
                        {dataDashboard?.projects.filter(project => project?.topicId !== null).length || 0}
                    </span> Approved
                </div>
            </Media>
            </Media>
        </Col>
        <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <div className="hr-text hr-text-left my-2">
            <span>My Projects</span>
            </div>
            <Media>
            <Media left className="mr-3">
                <TinyDonutChart 
                    dataDashboard = {dataDashboard}
                    type = "project"
                />
            </Media>
            <Media body>
                <div>
                <i className="fa fa-circle mr-1 text-yellow"></i>
                <span className="text-inverse">
                    {dataDashboard?.projects?.filter(project => project?.status === "In_Progress").length || 0}
                </span> In Progress
                </div>
                <div>
                <i className="fa fa-circle mr-1 text-success"></i>
                <span className="text-inverse">
                    {dataDashboard?.projects?.filter(project => project?.status === "Completed").length || 0}
                </span> Completed
                </div>
            </Media>
            </Media>
        </Col>
        </Row>
        <Row>
        
        <Col lg={6}>
    <Card className="mb-3">
        <CardBody>
            <CardTitle tag="h6">Meeting Schedule Mini</CardTitle>
            {(() => {
                let lastShownDate = null;
                const currentDate = new Date();
                const schedules = dataDashboard.groups
                    ?.flatMap((group) => group.meetingSchedules)
                    ?.filter((schedule) => new Date(schedule.meetingDate) >= currentDate)
                    ?.sort((a, b) => new Date(a.meetingDate) - new Date(b.meetingDate));

                if (!schedules || schedules.length === 0) {
                    return <p>No meeting scheduled yet!</p>;
                }

                return schedules.map((schedule) => {
                    const meetingDate = new Date(schedule.meetingDate);
                    const formattedDate = meetingDate.toLocaleDateString("vi-VN");
                    const showPillDate = formattedDate !== lastShownDate;
                    if (showPillDate) {
                        lastShownDate = formattedDate;
                    }

                    return (
                        <TimelineMini
                            key={schedule.scheduleId}
                            showPillDate={showPillDate}
                            groupName={schedule.groupName}
                            content={schedule.content}
                            duration={schedule.duration}
                            type={schedule.type}
                            url={schedule.url}
                            pillDate={formattedDate}
                            icon={schedule.type === "Online" ? "video-camera" : "university"}
                            iconClassName={schedule.type === "Online" ? "text-success" : "text-warning"}
                            badgeTitle={schedule.location}
                            badgeColor={schedule.location === "Online" ? "success" : "warning"}
                            meetingTitle={schedule.meetingScheduleName}
                            meetingDate={meetingDate.toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        />
                    );
                });
            })()}
        </CardBody>
    </Card>
</Col>
<Col lg={6}>
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
        {dataDashboard.projects && dataDashboard.projects.length > 0 ? (
            <DraggableProjects dataProjectsDashboard={dataDashboard.projects} />
        ) : (
            <p style={{ marginLeft: '20px' }}>No projects yet!</p>
        )}
    </Card>
</Col>

        </Row>
    </Container>
    );
};

export default setupPage({
  pageTitle: "Projects Dashboard",
})(MentorDashboard);
