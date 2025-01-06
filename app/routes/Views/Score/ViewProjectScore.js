import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import config from '../../../../config';

const ViewProjectScore = ({ projectId, subjectId, onClose }) => {
  const [milestoneScores, setMilestoneScores] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}api/projectscore/getprojectscorev2?projectId=${projectId}`,{
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setMilestoneScores(data.data.milestoneScores);
          setTotalScore(data.data.totalScore);
          setMilestones(data.data.milestoneIds);
          setLoading(false);
        } else {
          console.error('Error fetching project score:', data.errorMessage);
        }
      })
      .catch((err) => {
        console.error('Error fetching project score:', err);
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

    worksheetData.push(['Milestone', 'Score']);

    milestoneScores.forEach((milestone) => {
      const milestoneName = getMilestoneName(milestone.milestoneId);
      const score = milestone.totalScore === -1 ? 'N/A' : milestone.totalScore;
      worksheetData.push([milestoneName, score]);
    });

    worksheetData.push(['Total Score', totalScore]);

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Project Score');

    const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelFile], { type: 'application/octet-stream' }), `ProjectScores_Project_${projectId}.xlsx`);
  };

  return (
    <Modal isOpen={true} toggle={onClose} size="xl">
      <ModalHeader toggle={onClose}>Project Score</ModalHeader>
      <ModalBody>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Milestone</th>
                  <th>Percentage</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {milestoneScores.map((milestone) => (
                  <tr key={milestone.milestoneId}>
                    <td>{getMilestoneName(milestone.milestoneId)}</td>
                    <td>{milestone.percentage}%</td>
                    <td>
                      {milestone.totalScore === -1 ? 'N/A' : milestone.totalScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <strong>Total Score: </strong>
              <span
                style={{
                  backgroundColor: getBackgroundColor(totalScore),
                  color: 'white',
                  padding: '2px 5px',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                }}
              >
                {totalScore}
              </span>
            </div>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          style={{
            backgroundColor: '#217346',
            color: 'white',
            border: 'none',
            fontWeight: 'bold',
          }}
          onClick={exportToExcel}
        >
          Export to Excel
        </Button>

        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ViewProjectScore.propTypes = {
  projectId: PropTypes.number.isRequired,
  subjectId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewProjectScore;
