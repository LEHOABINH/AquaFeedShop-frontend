import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from '../../../components';
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import { ApproveTopicContent } from "./components/ApproveTopicContent";
import { Paginations } from "../../components/Paginations";
import axios from 'axios';
import config from '../../../../config';
import { showToast } from "../Utils/Toast";
import { HeaderMain } from "../../components/HeaderMain";

const ApproveTopic = () => {
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
      const response = await axios.get(`${config.apiBaseUrl}api/reqTopic/GetGroupReqTopicList`, {
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
        title="Topic Request"
        className="mb-5 mt-4"
      />
      {/* <ProjectsSmHeader/> */}
      <Row>
        <Col lg={12}>
          <Card className="mb-3">
            <Table className="mb-0" responsive>
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>Subject Code</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentGroups.length === 0 ? ( // Hiển thị lỗi nếu có
                  <tr>
                    <td colSpan="6" >
                    No groups have topics yet.
                    </td>
                  </tr>
                ) : (
                  <ApproveTopicContent
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

export default ApproveTopic;
