import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from '../../../components';
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import { ApproveTopicDetailsContent } from "./components/ApproveTopicDetailsContent";
import { Paginations } from "../../components/Paginations";
import axios from 'axios';
import config from '../../../../config';
import { showToast } from "../Utils/Toast";
import { useLocation } from 'react-router-dom';

const ApproveTopicDetails = () => {
  const location = useLocation();
  const { groupId } = location.state || {}; // Lấy groupId từ state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [groupsPerPage, setGroupsPerPage] = useState(10);
  const [data, setData] = useState([]); // State lưu trữ dữ liệu từ API
  const [error, setError] = useState(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const loadGroups = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}api/reqTopic/GetReqTopicList/${groupId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setData(response.data.data); // Cập nhật dữ liệu
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
    loadGroups(); // Gọi API khi component được mount
  }, [groupId]); // Đảm bảo gọi lại API khi groupId thay đổi

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
      <Row>
        <Col lg={12}>
          <Card className="mb-3">
            <Table className="mb-0" responsive>
              <thead>
                <tr>
                  <th>Topic Name</th>
                  <th>Description</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
              {currentGroups.length === 0 ? ( 
                  <tr>
                    <td colSpan="6" >
                    Group has no topic.
                    </td>
                  </tr>
                ) : (
                <ApproveTopicDetailsContent 
                  data={currentGroups} 
                  onGroupSaved={loadGroups}
                  onTopicRejected={handleTopicRejected}
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

export default ApproveTopicDetails;
