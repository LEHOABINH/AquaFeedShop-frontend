import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from '../../../components';
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import { MyTopicContent } from "./components/MyTopicContent";
import { Paginations } from "../../components/Paginations";
import MyTopicFormModal from './components/MyTopicFormModal';
import axios from 'axios';
import config from '../../../../config';
import { showToast } from "../Utils/Toast";
import { HeaderMain } from "../../components/HeaderMain";

const MyTopic = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [groupsPerPage, setGroupsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [groupName, setGroupName] = useState(""); // Thêm state để lưu groupName

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
        setUserRole(response.data.data); // Lưu vai trò vào state
      } else {
        console.error('Failed to fetch Group Member Role');
      }
    } catch (error) {
      console.error('Error fetching Group Member Role:', error);
    }
  };

  const loadGroups = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}api/reqTopic/MyTopic`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setData(response.data.data); // Cập nhật dữ liệu
        if (response.data.data.length > 0) {
          setGroupName(response.data.data[0].groupName || ""); // Lấy groupName đầu tiên
        }
      } else {
        showToast("error", response.data.errorMessage || "Không tải được dữ liệu nhóm!");
      }
    } catch (error) {
      console.error("Không tải được dữ liệu nhóm!", error);
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
        title={"Register Topic"} // Hiển thị groupName nếu có
        className="mb-5 mt-4"
      />
      <ProjectsSmHeader
        subTitle="Register Topic"
        onAddNewClick={userRole === "Leader" ? toggleModal : null} />
      <Row>
        <Col lg={12}>
          <Card className="mb-3">
            <Table className="mb-0" responsive>
              <thead>
                <tr>
                  <th>Topic Name</th>
                  <th>Description</th>
                  <th>Subject Code</th>
                  {userRole === 'Leader' && <th className="text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentGroups.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      The group has no Topic yet.
                    </td>
                  </tr>
                ) : (
                  <MyTopicContent data={currentGroups} onGroupSaved={loadGroups} userRole={userRole} />
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
      <MyTopicFormModal
        isOpen={modalOpen}
        toggle={toggleModal}
        onGroupSaved={loadGroups}

      />
    </Container>
  );
};

export default MyTopic;
