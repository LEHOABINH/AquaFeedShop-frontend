import React, { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from "axios";
import config from "../../../../config";
import { showToast } from "../Utils/Toast";
import { Container } from "../../../components";
import { HeaderMain } from "../../components/HeaderMain";
import ModalEventDetails from "./components/ModalEventDetails";
import ModalCreateEvent from "./components/ModalCreateEvent";
import useAuth from "../../../../hooks/useAuth";

const DragAndDropCalendar = BigCalendar;
const localizer = momentLocalizer(moment);

const CustomEvent = ({ event }) => {
    return (
        <div>
            <strong>{event.group}</strong>
            <p style={{ margin: "0", fontSize: "12px" }}>
                Name: {event.name} <br />
                Type: {event.type} <br />
            </p>
        </div>
    );
};

const MeetingSchedule = () => {
    const { role } = useAuth();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
    const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await axios.get(`${config.apiBaseUrl}api/meeting-schedules/events`, {
                    withCredentials: true,
                });
                if (response.data.success) {
                    const events = response.data.data.map(event => ({
                        id: event.scheduleId,
                        name: event.meetingScheduleName,
                        content: event.content,
                        start: new Date(event.startDate),
                        end: new Date(event.endDate),
                        topic: event.topicName,
                        group: event.groupName,
                        location: event.location,
                        mentor: event.mentorName,
                        type: event.type,
                        url: event.url,
                    }));
                    console.log("Processed Events:", events);
                    setEvents(events);
                } else {
                    showToast("error", response.data.errorMessage);
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu từ API:", error);
            }
        }
        fetchEvents();
    }, []);

    const newEvent = (event) => {
        if (view === 'month') {
            setView('day');
            setDate(event.start);
        } else {
            const currentTime = new Date();
            if (event.start < currentTime) {
                showToast("error", "Cannot create event in past time!");
                return;
            }
            if (role === 'Mentor') {
                setIsCreateEventModalOpen(true);
                setSelectedEvent({
                    start: event.start,
                    end: event.end,
                });
            }
        }
    };

    const handleSelectEvent = (event) => {
        console.log("Selected Event:", event);
        setSelectedEvent(event);
        setIsEventDetailsModalOpen(true);
    };

    const handleCreateEvent = (event) => {
        console.log("Saving Event:", event);
        setEvents(prevEvents => [
            ...prevEvents,
            {
                id: event.scheduleId,
                name: event.meetingScheduleName,
                content: event.content,
                start: new Date(event.startDate),
                end: new Date(event.endDate),
                topic: event.topicName,
                group: event.groupName,
                location: event.location,
                mentor: event.mentorName,
                type: event.type,
                url: event.url,
            }
        ]);
        setIsCreateEventModalOpen(false);
    };

    const handleSaveEvent = (updatedEvent) => {
        setEvents(prevEvents => prevEvents.map(event => 
            event.id === updatedEvent.id ? updatedEvent : event
        ));
        setIsEventDetailsModalOpen(false);
    };

    const handleDeleteEvent = (eventId) => {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        setIsEventDetailsModalOpen(false);
    };

    return (
        <Container>
            <HeaderMain title="Meeting Schedule" className="mb-5 mt-4" />
            <DragAndDropCalendar
                style={{ minHeight: '720px' }}
                selectable
                localizer={localizer}
                events={events}
                components={{ event: CustomEvent }}
                onSelectSlot={newEvent}
                onSelectEvent={handleSelectEvent}
                view={view} 
                date={date} 
                onNavigate={(date) => setDate(date)} 
                onView={(view) => setView(view)} 
            />
            <ModalEventDetails
                isOpen={isEventDetailsModalOpen}
                toggle={() => setIsEventDetailsModalOpen(!isEventDetailsModalOpen)}
                event={selectedEvent}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
            />
            <ModalCreateEvent
                isOpen={isCreateEventModalOpen}
                toggle={() => setIsCreateEventModalOpen(!isCreateEventModalOpen)}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                onSave={handleCreateEvent}
            />
        </Container>
    );
};

export default MeetingSchedule;
