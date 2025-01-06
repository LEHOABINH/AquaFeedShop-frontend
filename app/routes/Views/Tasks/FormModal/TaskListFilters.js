import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../../../config';
import {
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
  InputGroup,
  InputGroupAddon,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from '../../../../components';

const TaskListFilters = ({ filters, onFilterChange }) => {
    const [teamMembers, setTeamMembers] = useState([]);

    const fetchTeammate = async () => {
        try {
          const response = await axios.get(`${config.apiBaseUrl}api/groupMember/MyGroup`, {
            withCredentials: true,
          });
    
          if (response.data?.success) {
            setTeamMembers(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching Teammate:', error);
        }
    };

    useEffect(() => {
        fetchTeammate();
    }, []);
    
  return (
    <Card className="mb-3 p-3">
      <Row>
        <Col md={3}>
          <FormGroup>
            <Label for="statusFilter">Status</Label>
            <Input
              type="select"
              name="status"
              id="statusFilter"
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Not_Started">Not Started</option>
              <option value="In_Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="titleFilter">Title & Description</Label>
            <Input
              type="text"
              name="title"
              id="titleFilter"
              placeholder="Search by title..."
              value={filters.title}
              onChange={(e) => onFilterChange('title', e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="dateFilter">Start Date</Label>
            <Input
              type="date"
              name="startDate"
              id="dateFilter"
              value={filters.startDate}
              onChange={(e) => onFilterChange('startDate', e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="endDateFilter">End Date</Label>
            <Input
              type="date"
              name="endDate"
              id="endDateFilter"
              value={filters.endDate}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <FormGroup>
            <Label for="progressFilter">Progress</Label>
            <Input
              type="select"
              name="progress"
              id="progressFilter"
              value={filters.progress}
              onChange={(e) => onFilterChange('progress', e.target.value)}
            >
              <option value="">All Progress</option>
              <option value="0-25">0-25%</option>
              <option value="26-50">26-50%</option>
              <option value="51-75">51-75%</option>
              <option value="76-100">76-100%</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md={3}>
            <FormGroup>
            <Label for="assigneeFilter">Assignee</Label>
            <Input
                type="select"
                name="assignee"
                id="assigneeFilter"
                value={filters.assignee}
                onChange={(e) => onFilterChange('assignee', e.target.value)}
            >
                <option value="">All Members</option>
                {teamMembers.map((member) => (
                <option key={member.studentId} value={member.studentId}>
                    {member.fullName} ({member.studentCode})
                </option>
                ))}
            </Input>
            </FormGroup>
        </Col>
        <Col md={6} className="d-flex align-items-center" style={{marginTop: '12px'}}>
            <Button
                color="secondary"
                className="mr-2"
                onClick={() => onFilterChange('reset')}
            >
                Reset Filters
            </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default TaskListFilters;