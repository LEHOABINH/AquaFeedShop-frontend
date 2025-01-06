import React, { useState, useEffect } from 'react';
import {
  Button,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from './../../../components';
import PropTypes from 'prop-types';
import config from '../../../../config';
import { showToast } from '../Notification';
import axios from 'axios';

const ProjectScore = ({ projectId, subjectId, onClose }) => {
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [comment, setComment] = useState('');
  const [showMilestones, setShowMilestones] = useState(false);
  const [milestoneScore, setMilestoneScore] = useState(null);

  useEffect(() => {
    if (projectId && subjectId) {
      fetchMilestones(subjectId);
    }
  }, [projectId, subjectId]);

  const fetchMilestones = async (subjectId) => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}api/MileStone/getundeletemilestonesbysubjectid?subjectId=${subjectId}`,{
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setMilestones(response.data.data);
        setShowMilestones(true);
      } else {
        console.error('Failed to fetch milestones:', response.data.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const fetchMilestoneDetails = async (milestoneId) => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}api/MileStone/getmilestonebyid?id=${milestoneId}`,{
        withCredentials: true,
      });
      if (response.data.success) {
        setSelectedMilestone(response.data.data);
        setCriteria(response.data.data.criteria);
        fetchMilestoneScore(projectId, milestoneId);
      } else {
        console.error('Failed to fetch milestone details:', response.data.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching milestone details:', error);
    }
  };

  const fetchMilestoneScore = async (projectId, milestoneId) => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}api/projectscore/getmilestonescore?projectId=${projectId}&mileStoneId=${milestoneId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const { totalScore, criterionScores } = response.data.data;

        setMilestoneScore(totalScore);

        setCriteria((prevCriteria) =>
          prevCriteria.map((criterion) => {
            const matchedScore = criterionScores.find(
              (score) => score.criteriaId === criterion.criteriaId
            );
            return {
              ...criterion,
              score: matchedScore ? matchedScore.score : null,
            };
          })
        );
      } else {
        console.error('Failed to fetch milestone score:', response.data.errorMessage);
        setMilestoneScore(null);
      }
    } catch (error) {
      console.error('Error fetching milestone score:', error);
      setMilestoneScore(null);
    }
  };

  const handleMilestoneSelect = (milestoneId) => {
    fetchMilestoneDetails(milestoneId);
  };

  const handleScoreChange = (criterionId, score) => {
    const parsedScore = parseFloat(score);
  
    if (!isNaN(parsedScore) && (parsedScore < 0 || parsedScore > 10)) {
      return;
    }
  
    setScores((prevScores) => ({
      ...prevScores,
      [criterionId]: parsedScore >= 0 ? parsedScore : '',
    }));
  };

  const handleSubmitScores = async () => {
    const projectScores = criteria.map((criterion) => ({
      criteriaId: criterion.criteriaId,
      score: parseFloat(scores[criterion.criteriaId]) || 0,
    }));

    const payload = {
      projectScoreId: 0,
      projectId,
      comment,
      projectScores,
    };

    try {
      const response = await axios.post(`${config.apiBaseUrl}api/projectscore/submitprojectscore`, payload, {
        withCredentials: true,
      });
      if (response.status === 200) {
        showToast('success', 'Submit Project Score Successfully!');
        onClose();
      } else {
        console.error('Failed to submit scores:', response.data);
        alert('Failed to submit scores.');
      }
    } catch (error) {
      console.error('Error submitting scores:', error);
      alert('An error occurred while submitting scores.');
    }
  };

  return (
    <Modal isOpen={true} toggle={onClose} size="lg">
      <ModalHeader toggle={onClose}>Project Scoring</ModalHeader>
      <ModalBody>
        {showMilestones && milestones.length > 0 && (
          <>
            <Label for="milestoneSelect">Select Milestone</Label>
            <Input
              type="select"
              id="milestoneSelect"
              onChange={(e) => handleMilestoneSelect(parseInt(e.target.value))}
            >
              <option value="">Choose a Milestone</option>
              {milestones.map((milestone) => (
                <option key={milestone.milestoneId} value={milestone.milestoneId}>
                  {milestone.milestoneName}
                </option>
              ))}
            </Input>
          </>
        )}

        {selectedMilestone && (
          <div className="mt-3">
            <h5>Milestone Details</h5>
            <p>
              <strong>Name:</strong> {selectedMilestone.milestoneName}
            </p>
            <p>
              <strong>Description:</strong> {selectedMilestone.description}
            </p>
            <p>
              <strong>Percentage:</strong> {selectedMilestone.percentage}%
            </p>
            <p>
              <strong>Score:</strong>{' '}
              {milestoneScore === -1 ? 'N/A' : milestoneScore}
            </p>
          </div>
        )}

        {criteria.length > 0 && (
          <>
            <h5 className="mt-3">Criteria</h5>
            <Table bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Criterion Name</th>
                  <th>Percentage</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((criterion, index) => (
                  <tr key={criterion.criteriaId}>
                    <td>{index + 1}</td>
                    <td>{criterion.criteriaName}</td>
                    <td>{criterion.percentage}%</td>
                    <td>
                    <Input
                      type="number"
                      placeholder="Enter score"
                      value={
                        scores[criterion.criteriaId] ?? 
                        (criterion.score !== -1 ? criterion.score : '')
                      }
                      onChange={(e) => handleScoreChange(criterion.criteriaId, e.target.value)}
                      max={10} min={0} step={0.1}
                    />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Label for="comment" className="mt-3">Comment</Label>
            <Input
              type="text"
              id="comment"
              placeholder="Enter comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={handleSubmitScores} disabled={!selectedMilestone}>
          Submit Scores
        </Button>
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ProjectScore.propTypes = {
  projectId: PropTypes.number.isRequired,
  subjectId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProjectScore;
