import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../../../config';
import {
  Card,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
} from '../../../../components';

const FindGroupFilters = ({ filters, onFilterChange }) => {
  const [subjects, setSubjects] = useState([]);

  // Lấy danh sách mentor
  const fetchMentors = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}api/subject`, {
        withCredentials: true,
      });
      if (response.data?.success) {
        setSubjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return (
    <Card className="mb-3 p-3">
      <Row>
        {/* Bộ lọc Topic Name */}
        <Col md={3}>
          <FormGroup>
            <Label for="groupNameFilter">Group Name</Label>
            <Input
              type="text"
              name="groupName"
              id="groupNameFilter"
              placeholder="Search by Group Name..."
              value={filters.groupName}
              onChange={(e) => onFilterChange('groupName', e.target.value)}
            />
          </FormGroup>
        </Col>
        
        <Col md={3}>
          <FormGroup>
            <Label for="descriptionFilter">Description</Label>
            <Input
              type="text"
              name="description"
              id="descriptionFilter"
              placeholder="Search by Sescription..."
              value={filters.description}
              onChange={(e) => onFilterChange('description', e.target.value)}
            />
          </FormGroup>
        </Col>
        {/* Bộ lọc Số lượng thành viên */}
        <Col md={3}>
          <FormGroup>
            <Label for="subjectsFilter">Subjects</Label>
            <Input
              type="select"
              name="subjects"
              id="subjectsFilter"
              placeholder="Enter subjects..."
              value={filters.subjectCode}
                onChange={(e) => onFilterChange('subjectCode', e.target.value)}
            >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
            <option key={subject.subjectId} value={subject.subjectCode}>
                {subject.subjectCode} ({subject.subjectName})
            </option>
            ))}
            </Input>
          </FormGroup>
        </Col>
        <Col md={3} style={{marginTop: '30px'}}>
          <Button
            color="secondary"
            onClick={() => onFilterChange('reset')}
          >
            Reset Filters
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default FindGroupFilters;
