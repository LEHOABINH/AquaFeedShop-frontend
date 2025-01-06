import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from '../../../components';
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import { ProjectMentorContent } from "./components/ProjectMentorContent";
import { Paginations } from "../../components/Paginations";
import axios from 'axios';
import config from '../../../../config';
import { showToast } from "../Utils/Toast";
import { HeaderMain } from "../../components/HeaderMain";

const ProjectMentor = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [groupsPerPage, setGroupsPerPage] = useState(10);
  const [data, setData] = useState([]); // State lưu trữ dữ liệu từ API

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const loadGroups = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}api/projects/GetProjectByMentor`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setData(response.data.data); // Cập nhật dữ liệu
      } else {
        showToast("error", response.data.errorMessage || "Không tải được dữ liệu nhóm!");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errorMessage || "Không tải được dữ liệu nhóm!";
      setError('No project yet');
      console.error("Không tải được dữ liệu nhóm!", error);
    }
  };

  useEffect(() => {
    loadGroups(); // Gọi API khi component được mount
  }, []);

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

  return (
    <Container fluid>
      <HeaderMain
                    title="My Projects"
                    className="mb-5 mt-4"
                />
      {/* <ProjectsSmHeader onAddNewClick={toggleModal} /> */}
      <Row>
        <Col lg={12}>
          <Card className="mb-3">
            <Table className="mb-0" responsive>
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>Topic Name</th>
                  <th>Description</th>
                  <th>Subject Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td colSpan="7" >
                      {error}
                    </td>
                  </tr>
                ) : (
                  <ProjectMentorContent 
                    data={currentGroups} 
                    onGroupSaved={loadGroups}
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

export default ProjectMentor;
