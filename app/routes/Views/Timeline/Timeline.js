import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from './../../../components';
import { HeaderMain } from "../../components/HeaderMain";
import { TimelineDefault } from "./components/TimelineDefault";
import MainTimelineFormModal from './components/MainTimelineFormModal';
import SpecificTimelineFormModal from './components/SpecificTimelineFormModal';
import { showToast } from '../Notification';
import config from '../../../../config';
import axios from 'axios';
import useAuth from '../../../../hooks/useAuth';

const Timeline = () => {
    const [timelines, setTimelines] = useState([]);
    const [isMainModalOpen, setIsMainModalOpen] = useState(false);
    const [isSpecificModalOpen, setIsSpecificModalOpen] = useState(false);
    const [selectedTimeline, setSelectedTimeline] = useState(null);
    const { role } = useAuth();

    const fetchTimelines = () => {
        axios.get(`${config.apiBaseUrl}api/timeline`, {
            withCredentials: true,
        })
            .then(response => {
                if (response.data.success) {
                    setTimelines(response.data.data);
                } else {
                    console.error('Error fetching timelines:', response.data.errorMessage);
                }
            })
            .catch(error => {
                console.error('API error:', error);
            });
    };

    const handleAddMentorAutomatically = async () => {
        try {
            const response = await axios.post(
                `${config.apiBaseUrl}api/group/addmentortogroupautomatically`,
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                showToast("success", "Mentor added to group automatically!");
                //fetchGroups();
            } else {
                showToast("error", response.data.errorMessage || "Failed to add mentor.");
            }
        } catch (error) {
            console.error("Error adding mentor automatically:", error);
            showToast("error", "An error occurred while adding mentor.");
        }
    };

    const handleActiveEndDurationTimeline = async () => {
        try {
            const response = await axios.put(
                `${config.apiBaseUrl}api/timeline/activateenddurationtimeline`,  
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                showToast("success", "Activate End Duration Timeline Successfully!");
                //fetchGroups();
            } else {
                showToast("error", response.data.errorMessage || "Failed to assign.");
            }
        } catch (error) {
            console.error("Error assign group automatically:", error);
            showToast("error", "An error occurred while adding mentor.");
        }
    };

    const handleAssignGroupsAutomatically = async () => {
        try {
            const response = await axios.post(
                `${config.apiBaseUrl}api/group/assigngroupsautomatically`,  
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                showToast("success", "Groups have been successfully assigned!");
                //fetchGroups();
            } else {
                showToast("error", response.data.errorMessage || "Failed to assign.");
            }
        } catch (error) {
            console.error("Error assign group automatically:", error);
            showToast("error", "An error occurred while adding mentor.");
        }
    };

    useEffect(() => {
        fetchTimelines();
    }, []);

    const handleMainUpdate = () => {
        setIsMainModalOpen(true);
    };

    const handleSpecificUpdate = (timelineId) => {
        const timelineToUpdate = timelines.find(t => t.timelineId === timelineId);
        console.log(timelineToUpdate);
        setSelectedTimeline(timelineToUpdate);
        setIsSpecificModalOpen(true);
    };

    const getColor = (timelineId) => {
        switch (timelineId) {
            case 1:
            case 2:
                return "success";
            case 3:
            case 4:
                return "primary";
            case 5:
            case 6:
                return "info";
            case 7:
            case 8:
                return "warning";
            default:
                return "question";
        }
    };

    const getIconCircle = (timelineId) => {
        switch (timelineId) {
            case 1:
            case 2:
                return "superpowers";
            case 3:
            case 4:
                return "user-plus";
            case 5:
            case 6:
                return "handshake-o";
            case 7:
            case 8:
                return "flag";
            default:
                return "question";
        }
    };
    return (
        <React.Fragment>
            <Container>
                <HeaderMain title="Timeline" className="mb-2" />
                {role === 'Manager' && (
                    <>
                        <Button className="mb-4" color="primary" onClick={handleMainUpdate}>
                            Update main timeline
                        </Button>
                        <Row className="mb-2">
                            <Col xs="auto">
                                <Button
                                    color="primary"
                                    size="sm"
                                    onClick={() => handleAssignGroupsAutomatically()}
                                >
                                    Assign Groups Automatically
                                </Button>
                            </Col>
                            <Col xs="auto">
                                <Button
                                    color="primary"
                                    size="sm"
                                    onClick={() => handleAddMentorAutomatically()}
                                >
                                    Assign Mentors Automatically
                                </Button>
                            </Col>
                            <Col xs="auto">
                                <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => handleActiveEndDurationTimeline()}
                                >
                                    Activate End Duration Timeline
                                </Button>
                            </Col>
                        </Row>
                    </>
                )}
                <Row>
                    <Col lg={6}>
                        <h5>EXE101 Timelines</h5>
                        {timelines
                            .filter(timeline => timeline.subjectId === 1)
                            .map((timeline, index) => {
                                const startDate = new Date(timeline.startDate).toLocaleDateString('en-US');
                                const endDate = new Date(timeline.endDate).toLocaleDateString('en-US');

                                return (
                                    <TimelineDefault
                                        key={timeline.timelineId}
                                        showPillDate
                                        pillDate={`${startDate} - ${endDate}`}
                                        smallIconColor={getColor(timeline.timelineId)}
                                        iconCircleColor={getColor(timeline.timelineId)}
                                        iconCircle={getIconCircle(timeline.timelineId)}
                                        description={timeline.description}
                                        title={timeline.timelineName}
                                        timelineId={timeline.timelineId}
                                        onUpdate={handleSpecificUpdate}
                                    />
                                );
                            })}
                    </Col>

                    <Col lg={6}>
                        <h5>EXE201 Timelines</h5>
                        {timelines
                            .filter(timeline => timeline.subjectId === 2)
                            .map((timeline, index) => {
                                const startDate = new Date(timeline.startDate).toLocaleDateString('en-US');
                                const endDate = new Date(timeline.endDate).toLocaleDateString('en-US');

                                return (
                                    <TimelineDefault
                                        key={timeline.timelineId}
                                        showPillDate
                                        pillDate={`${startDate} - ${endDate}`}
                                        smallIconColor={getColor(timeline.timelineId)}
                                        iconCircleColor={getColor(timeline.timelineId)}
                                        iconCircle={getIconCircle(timeline.timelineId)}
                                        description={timeline.description}
                                        title={timeline.timelineName}
                                        timelineId={timeline.timelineId}
                                        onUpdate={handleSpecificUpdate}
                                    />
                                );
                            })}
                    </Col>
                </Row>
            </Container>

            <MainTimelineFormModal
                isOpen={isMainModalOpen}
                toggle={() => setIsMainModalOpen(!isMainModalOpen)}
                onTimelineSaved={fetchTimelines}
            />

            {selectedTimeline && (
                <SpecificTimelineFormModal
                    isOpen={isSpecificModalOpen}
                    toggle={() => setIsSpecificModalOpen(!isSpecificModalOpen)}
                    selectedTimeline={selectedTimeline}
                    onTimelineUpdated={fetchTimelines}
                />
            )}
        </React.Fragment>
    );
};

export default Timeline;
