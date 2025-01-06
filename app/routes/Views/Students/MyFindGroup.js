import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from '../../../components';
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import { MyFindGroupContent } from "./components/MyFindGroupContent";
import { Paginations } from "../../components/Paginations";
import FindGroupFormModal from './components/FindGroupFormModal';
import axios from 'axios';
import config from '../../../../config';
import { showToast } from "./../Utils/Toast"; // Nhập showToast
import { HeaderMain } from "../../components/HeaderMain";

const MyFindGroup = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [groupsPerPage, setGroupsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null); 
  const [role, setRole] = useState(null); 

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const [userRole, setUserRole] = useState(null);
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
      const response = await axios.get(`${config.apiBaseUrl}api/reqMembers/MyFindGroup`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const groupData = response.data.data;
        setData(groupData);
        setError(null);
        if (groupData.length > 0) {
          setRole(groupData[0].role);
        }
      } else {
        const errorMessage = response.data.errorMessage || "Không tải được dữ liệu nhóm!";
        setError(errorMessage);
        showToast("error", errorMessage);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errorMessage || "Nhóm chưa có yêu cầu nào!";
      setError(errorMessage);
      console.error("Error fetching group members:", error);
    }
  };

  useEffect(() => {
    fetchUserRole();
    loadGroups();
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
        title="Find members"
        className="mb-5 mt-4"
      />
      <ProjectsSmHeader
        subTitle="Find Groups"
        subTitleLink="/Views/Students/FindGroups"
        title="Find members"
        linkList="/Views/Students/MyFindGroup"
        onAddNewClick={userRole === "Leader" ? toggleModal : null} />
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
                  {role === "Leader" && (
                    <th className="text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentGroups.length === 0 ? (
                  <tr>
                    <td colSpan="6" >
                      The group has no requests yet.
                    </td>
                  </tr>
                ) : (
                  <MyFindGroupContent
                    data={currentGroups}
                    role={role}
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
      <FindGroupFormModal
        isOpen={modalOpen}
        toggle={toggleModal}
        onGroupSaved={loadGroups}
      />
    </Container>
  );
};

export default MyFindGroup;
