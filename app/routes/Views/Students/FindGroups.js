import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button } from '../../../components';
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import { FindGroupContent } from "./components/FindGroupContent";
import { Paginations } from "../../components/Paginations";
import FindGroupFormModal from './components/FindGroupFormModal';
import axios from 'axios';
import config from '../../../../config';
import { useHistory } from 'react-router-dom'; // Import useHistory để chuyển hướng
import FindGroupFilters from '../Students/components/FindGroupFilters';
import { HeaderMain } from "../../components/HeaderMain";

const FindGroups = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [groupsPerPage, setGroupsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const history = useHistory(); // Khởi tạo useHistory để điều hướng


  const [filters, setFilters] = useState({
    description: '',
    subjectCode: '',
    groupName: ''
  });
  const [filteredFindGroups, setFilteredFindGroups] = useState([]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}api/role/GetRoleByUserId`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setUserRole(response.data.data); // Lưu vai trò vào state
        } else {
          console.error('Failed to fetch Group Member Role');
        }
      } catch (error) {
        console.error('Error fetching Group Member Role:', error);
      }
    };

    fetchUserRole();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}api/reqMembers`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Không tải được dữ liệu nhóm!", error);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    filterFindGroups();
  }, [data, filters]);

  const handleFilterChange = (filterName, value) => {
    if (filterName === 'reset') {
      setFilters({
        description: '',
        subjectCode: '',
        groupName: ''
      });
      return;
    }

    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const filterFindGroups = () => {
    let filtered = [...data];

    // Filter by title/description
    if (filters.groupName) {
      const searchTerm = filters.groupName.toLowerCase();
      filtered = filtered.filter(findGroup =>
        findGroup.groupName.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by title/description
    if (filters.description) {
      const searchTerm = filters.description.toLowerCase();
      filtered = filtered.filter(findGroup =>
        findGroup.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by assignee
    if (filters.subjectCode) {
      const searchTerm = filters.subjectCode.toLowerCase();
      filtered = filtered.filter(findGroup =>
        findGroup.subjectCode.toLowerCase().includes(searchTerm)
      )
    }

    setFilteredFindGroups(filtered);
  };

  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredFindGroups.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(filteredFindGroups.length / groupsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleGroupsPerPageChange = (event) => {
    setGroupsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleMyFindGroupClick = () => {
    // Điều hướng đến trang MyFindGroup khi nhấn nút
    history.push('/Views/Students/MyFindGroup');
  };

  return (
    <Container fluid>
      <HeaderMain
        title="Find Groups"
        className="mb-5 mt-4"
      />
      <ProjectsSmHeader 
      subTitle="Find Groups"
      onAddNewClick={userRole === "Leader" ? toggleModal : null} />
      <Row>
        <Col lg={10}>
          <FindGroupFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </Col>
        <Col lg={2}>
          <Row className="mb-3">
            <Col className="text-right">
              <Button color="primary" onClick={handleMyFindGroupClick}>
                Find members
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card className="mb-3">
            <Table className="mb-0" responsive>
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>Description</th>
                  <th>Subject</th>
                  <th>Member</th>
                  <th>Leader Name</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <FindGroupContent data={currentGroups} />
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
      <Paginations
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onRecordsPerPageChange={handleGroupsPerPageChange}
        recordsPerPage={groupsPerPage}
      />
      <FindGroupFormModal isOpen={modalOpen} toggle={toggleModal} onGroupSaved={loadGroups} />
    </Container>
  );
};

export default FindGroups;
