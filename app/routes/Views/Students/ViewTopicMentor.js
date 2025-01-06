import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from '../../../components';
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import { ViewTopicMentorContent } from "./components/ViewTopicMentorContent";
import { Paginations } from "../../components/Paginations";
import axios from 'axios';
import config from '../../../../config';
import { showToast } from "../Utils/Toast";
import { useLocation } from 'react-router-dom';
import { HeaderMain } from "../../components/HeaderMain";

const ViewTopicMentor = () => {
  const location = useLocation();
  const { groupId } = location.state || {};
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [groupsPerPage, setGroupsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const fetchUserRole = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}api/role/GetRoleByUserId`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUserRole(response.data.data);
      } else {
        console.error('Failed to fetch Group Member Role');
      }
    } catch (error) {
      console.error('Error fetching Group Member Role:', error);
    }
  };

  const loadGroups = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}api/topicMentor/ViewTopicMentor`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setData(response.data.data);
      } else {
        showToast("error", response.data.errorMessage || "Không tải được dữ liệu nhóm!");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errorMessage || "Không tải được dữ liệu nhóm!";
      console.error("Không tải được dữ liệu nhóm!", error);
      setError('Lỗi kết nối');
    }
  };

  useEffect(() => {
    fetchUserRole();
    loadGroups();
  }, [groupId]);

  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = data.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(data.length / groupsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleGroupsPerPageChange = (event) => {
    setGroupsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleTopicRejected = () => {
    loadGroups();
  };

  return (
    <Container fluid>
      <HeaderMain
        title="Topics of mentor"
        className="mb-5 mt-4"
      />
     
      <Row>
        <Col lg={12}>
          <Card className="mb-3">
            <Table className="mb-0" responsive>
              <thead>
                <tr>
                  <th>Topic Name</th>
                  <th>Description</th>
                  <th>Mentor</th>
                  <th className="text-center">Is Registered</th>
                  {userRole === 'Leader' && <th className="text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentGroups.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      Mentor has no topic yet.
                    </td>
                  </tr>
                ) : (
                  <ViewTopicMentorContent
                    data={currentGroups}
                    onGroupSaved={loadGroups}
                    userRole={userRole}
                  />
                )}
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
    </Container>
  );
};

export default ViewTopicMentor;
