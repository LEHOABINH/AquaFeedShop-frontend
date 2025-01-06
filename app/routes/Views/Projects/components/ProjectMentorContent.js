import React, { useState } from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import config from '../../../../../config';
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from '../../../../components';
import ProjectScore from '../../Score/ProjectScore';
import MemberScore from '../../Score/MemberScore';
import ViewMemberScore from '../../Score/ViewMemberScore'; 
import ViewProjectScore from '../../Score/ViewProjectScore'; 
import { useHistory } from 'react-router-dom';
import { showToast } from "../../Utils/Toast";

const ProjectMentorContent = ({ data }) => {
  const history = useHistory(); // Khởi tạo useHistory
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteRegTopicId, setDeleteRegTopicId] = useState(null);
  const [description, setDescription] = useState('');
  const [topicName, setTopicName] = useState('');
  const [regTopicId, setRegTopicId] = useState('');

  const [isProjectScoreOpen, setIsProjectScoreOpen] = useState(false);
  const [isMemberScoreOpen, setIsMemberScoreOpen] = useState(false);
  const [isViewMemberScoreOpen, setIsViewMemberScoreOpen] = useState(false); 
  const [isViewProjectScoreOpen, setIsViewProjectScoreOpen] = useState(false); 
  const [selectedProject, setSelectedProject] = useState(null);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  const handleProjectScoreClick = (projectId, subjectId) => {
    setSelectedProject({ projectId, subjectId });
    setIsProjectScoreOpen(true);
  };

  const handleMemberScoreClick = (projectId, subjectId) => {
    setSelectedProject({ projectId, subjectId });
    setIsMemberScoreOpen(true);
  };

  const handleViewMemberScoreClick = (projectId, subjectId) => {
    setSelectedProject({ projectId, subjectId });
    setIsViewMemberScoreOpen(true); 
  };

  const handleViewProjectScoreClick = (projectId, subjectId) => {
    setSelectedProject({ projectId, subjectId });
    setIsViewProjectScoreOpen(true); 
  };

  const closeProjectScore = () => {
    setIsProjectScoreOpen(false);
    setSelectedProject(null);
  };

  const closeMemberScore = () => {
    setIsMemberScoreOpen(false);
    setSelectedProject(null);
  };

  const closeViewMemberScore = () => {
    setIsViewMemberScoreOpen(false); 
    setSelectedProject(null);
  };

  const closeViewProjectScore = () => {
    setIsViewProjectScoreOpen(false); 
    setSelectedProject(null);
  };

  const handleProgressClick = (projectId) => {
    history.push(`/apps/mentor/project/progress/${projectId}`);
  };

  const handleDocumentClick = (projectId) => {
    history.push(`/apps/mentor/project/document/${projectId}`);
  };

  const handleDownload = async (TopicId) => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}api/topic/download?TopicId=${TopicId}`);

      if (response.status === 200 && response.data.url) {
        const fileUrl = response.data.url;

        const anchor = document.createElement('a');
        anchor.href = fileUrl;
        anchor.target = '_self';

        if (navigator.msSaveOrOpenBlob) {
          const blobResponse = await axios.get(fileUrl, { responseType: 'blob' });
          const blob = new Blob([blobResponse.data]);
          navigator.msSaveOrOpenBlob(blob, 'download');
        } else {
          anchor.download = '';
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
        }

        showToast("success", "File is downloading!");
      } else {
        showToast("error", "Failed to get file URL.");
      }
    } catch (error) {
      showToast("error", `Error: ${error.response?.data?.errorMessage || "Something went wrong!"}`);
    }
  };

  return (
    <React.Fragment>
      {data.map((item) => (
        <tr key={item.projectId}>
          <td>{item.groupName}</td>
          <td>{item.topicName}</td>
          <td
            style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
            onClick={() => handleDownload(item.topicId)}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
          >
            {item.description.split('/').pop()}
          </td>
          <td>{item.subjectName}</td>
          <td>{new Date(item.startDate).toLocaleDateString()}</td>
          <td>{new Date(item.endDate).toLocaleDateString()}</td>
          <td className="text-right">
            <UncontrolledButtonDropdown>
              <DropdownToggle color="link" className="pr-0">
                <i className="fa fa-gear"></i>
                <i className="fa fa-angle-down ml-2"></i>
              </DropdownToggle>

              <DropdownMenu right container="body">
                <DropdownItem onClick={() => handleProjectScoreClick(item.projectId, item.subjectId)}>
                  <i className="fa fa-fw fa-address-book mr-2"></i>
                  Score project
                </DropdownItem>

                <DropdownItem onClick={() => handleMemberScoreClick(item.projectId, item.subjectId)}>
                  <i className="fa fa-fw fa-users mr-2"></i>
                  Score member
                </DropdownItem>

                <DropdownItem onClick={() => handleViewMemberScoreClick(item.projectId, item.subjectId)}>
                  <i className="fa fa-fw fa-eye mr-2"></i>
                  View member score
                </DropdownItem>

                <DropdownItem onClick={() => handleViewProjectScoreClick(item.projectId, item.subjectId)}>
                  <i className="fa fa-fw fa-bullseye mr-2"></i>
                  View project score
                </DropdownItem>

                <DropdownItem onClick={(e) => {
                  e.preventDefault();
                  handleProgressClick(item.projectId);
                }}>
                  <i className="fa fa-fw fa-line-chart mr-2"></i>
                  Progress
                </DropdownItem>
                
                <DropdownItem onClick={(e) => {
                  e.preventDefault();
                  handleDocumentClick(item.projectId);
                }}>
                  <i className="fa fa-fw fa-file-text mr-2"></i>
                  View Document
                </DropdownItem>

              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </td>
        </tr>
      ))}

      {isProjectScoreOpen && selectedProject && (
        <ProjectScore
          projectId={selectedProject.projectId}
          subjectId={selectedProject.subjectId}
          onClose={closeProjectScore}
        />
      )}

      {isMemberScoreOpen && selectedProject && (
        <MemberScore
          projectId={selectedProject.projectId}
          subjectId={selectedProject.subjectId}
          onClose={closeMemberScore}
        />
      )}

      {isViewMemberScoreOpen && selectedProject && (
        <ViewMemberScore
          projectId={selectedProject.projectId}
          subjectId={selectedProject.subjectId}
          onClose={closeViewMemberScore}
        />
      )}

      {isViewProjectScoreOpen && selectedProject && (
        <ViewProjectScore
          projectId={selectedProject.projectId}
          subjectId={selectedProject.subjectId}
          onClose={closeViewProjectScore}
        />
      )}
    </React.Fragment>
  );
};

ProjectMentorContent.propTypes = {
  data: PropTypes.array.isRequired,
};

export { ProjectMentorContent };
