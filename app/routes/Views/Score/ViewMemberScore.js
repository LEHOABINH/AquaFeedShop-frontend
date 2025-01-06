import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import config from '../../../../config';

  const ViewMemberScore = ({ projectId, subjectId, onClose }) => {
  const [members, setMembers] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}api/memberscore/gettotalmemberscorev2?projectId=${projectId}`,{
        withCredentials: true,
      })
      .then(response => {
        const data = response.data;
        if (data.success) {
          setMembers(data.data.members);
          setMilestones(data.data.milestoneIds);
          setLoading(false);
        } else {
          console.error('Error fetching member scores:', data.errorMessage);
        }
      })
      .catch(err => {
        console.error('Error fetching member scores:', err);
      });
  }, [projectId, subjectId]);

  const getBackgroundColor = (score) => {
    if (score >= 9) return 'green';
    if (score >= 8) return 'yellowgreen';
    if (score >= 6) return 'orange';
    if (score >= 5) return 'yellow';
    return 'red';
  };

  const getMilestoneName = (milestoneId) => {
    const milestone = milestones.find((m) => m.milestoneId === milestoneId);
    return milestone ? milestone.milestoneName : 'Unknown Milestone';
  };

  const exportToExcel = () => {
    const worksheetData = [];
  
    const header = ['Student Name', ...milestones.map(m => m.milestoneName), 'Total Score'];
    worksheetData.push(header);
  
    members.forEach((member) => {
      const row = [
        member.studentName,
        ...milestones.map((milestone) => {
          const milestoneScore = member.milestoneScores.find(m => m.milestoneId === milestone.milestoneId);
          return milestoneScore && milestoneScore.score === -1 ? 'N/A' : milestoneScore?.score || 'N/A';
        }),
        member.totalScore
      ];
      worksheetData.push(row);
    });
  
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Member Scores');

    const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelFile], { type: 'application/octet-stream' }), `MemberScores_Project_${projectId}.xlsx`);
  };
  

  return (
    <Modal isOpen={true} toggle={onClose} size="xl">
      <ModalHeader toggle={onClose}>Member Scores</ModalHeader>
      <ModalBody>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  {milestones.map((milestone) => (
                    <th key={milestone.milestoneId}>
                      {milestone.milestoneName} ({milestone.percentage ? milestone.percentage : 'N/A'}%)
                    </th>
                  ))}
                  <th>Total Score</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.studentId}>
                    <td>{member.studentName}</td>
                    {milestones.map((milestone) => {
                      const milestoneScore = member.milestoneScores.find(m => m.milestoneId === milestone.milestoneId);
                      return (
                        <td key={milestone.milestoneId}>
                          {milestoneScore?.score === -1 ? 'N/A' : milestoneScore.score}
                        </td>
                      );
                    })}
                    <td>
                      <span
                        style={{
                          backgroundColor: getBackgroundColor(member.totalScore),
                          color: 'white',
                          padding: '2px 5px',
                          borderRadius: '5px',
                        }}
                      >
                        {member.totalScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button style={{
              backgroundColor: '#217346',
              color: 'white',
              border: 'none',
              fontWeight: 'bold',
            }} onClick={exportToExcel}>
              Export to Excel
            </Button>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ViewMemberScore.propTypes = {
  projectId: PropTypes.number.isRequired,
  subjectId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewMemberScore;
