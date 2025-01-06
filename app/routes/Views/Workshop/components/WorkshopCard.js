import React, { useState } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from './../../../components';
import useAuth from '../../../../hooks/useAuth';

const WorkshopCard = ({ workshop, onEdit, onDelete }) => {
    const { role } = useAuth();
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            timeZone: 'Asia/Ho_Chi_Minh' 
        });
    };

    return (
        <Card className="mb-3 shadow-sm">
            <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <CardTitle tag="h5" className="mb-2">{workshop.name}</CardTitle>
                        <CardText className="text-muted mb-2">{workshop.description}</CardText>
                    </div>
                    {role === 'Manager' && (
                        <UncontrolledButtonDropdown>
                            <DropdownToggle color="link" className="p-0">
                                <i className="fa fa-ellipsis-v"></i>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem onClick={onEdit}>
                                    <i className="fa fa-pencil mr-2"></i>Edit
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={onDelete}>
                                    <i className="fa fa-trash mr-2"></i>Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                    )}
                </div>
                
                <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                        <i className="fa fa-calendar mr-2 text-muted"></i>
                        <span>{formatDate(workshop.startDate)}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                        <i className="fa fa-clock-o mr-2 text-muted"></i>
                        <span>{formatTime(workshop.startDate)} - {formatTime(workshop.endDate)}</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <i className="fa fa-map-marker mr-2 text-muted"></i>
                        <span>{workshop.location}</span>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <span 
                        className={`badge ${
                            workshop.status === 'Upcoming' ? 'badge-primary' : 
                            workshop.status === 'Ongoing' ? 'badge-success' : 
                            'badge-secondary'
                        }`}
                    >
                        {workshop.status}
                    </span>

                    {role === 'Student' && (
                        <a
                            href={workshop.regUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                        >
                            Register
                        </a>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};