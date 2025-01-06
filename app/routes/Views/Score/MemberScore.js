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

const MemberScore = ({ projectId, subjectId, onClose }) => {
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [members, setMembers] = useState([]);
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState({});

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
      } else {
        console.error('Failed to fetch milestones:', response.data.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const fetchMembers = async (milestoneId) => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}api/groupMember/getmembergroupbyprojectid?projectId=${projectId}`,{
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setMembers(response.data.data);
        setSelectedMilestone(milestoneId);

        getMemberScore(projectId, milestoneId);
      } else {
        console.error('Failed to fetch members:', response.data.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const getMemberScore = async (projectId, milestoneId) => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}api/memberscore/getmemberscore?projectId=${projectId}&mileStoneId=${milestoneId}`,{
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const memberScores = response.data.data.members;
        const newScores = {};
        const newComments = {};

        memberScores.forEach((member) => {
          newScores[member.studentId] = member.score === -1 ? '' : member.score;
          newComments[member.studentId] = member.comment;
        });

        setScores(newScores);
        setComments(newComments);
      } else {
        console.error('Failed to fetch member scores:', response.data.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching member scores:', error);
    }
  };

  const handleMilestoneSelect = (milestoneId) => {
    fetchMembers(milestoneId);
  };

  const handleScoreChange = (studentId, score) => {
    if (score === '-1') {
      setScores((prevScores) => ({
        ...prevScores,
        [studentId]: '',
      }));
    } else {
      const parsedScore = parseFloat(score);
      if (!isNaN(parsedScore) && (parsedScore < 0 || parsedScore > 10)) {
        return;
      }

      setScores((prevScores) => ({
        ...prevScores,
        [studentId]: score,
      }));
    }
  };

  const handleCommentChange = (studentId, comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [studentId]: comment,
    }));
  };

  const handleSubmitScores = async () => {
    const studentScores = members.map((member) => ({
      studentId: member.student.studentId,
      score: scores[member.student.studentId] === '' ? -1 : parseFloat(scores[member.student.studentId]) || 0,
      comment: comments[member.student.studentId] || '',
    }));

    const payload = {
      projectId,
      milestoneId: selectedMilestone,
      studentScores,
    };

    try {
      const response = await axios.post(`${config.apiBaseUrl}api/memberscore/submitmemberscore`, payload, {
        withCredentials: true,
      });

      if (response.data.success) {
        showToast('success', 'Submitted Member Scores Successfully!');
        onClose();
      } else {
        console.error('Failed to submit member scores:', response.data.errorMessage);
      }
    } catch (error) {
      console.error('Error submitting member scores:', error);
    }
  };

  return (
    <Modal isOpen={true} toggle={onClose} size="lg">
      <ModalHeader toggle={onClose}>Member Scoring</ModalHeader>
      <ModalBody>
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

        {members.length > 0 && (
          <>
            <h5 className="mt-3">Group Members</h5>
            <Table bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Student Code</th>
                  <th>Role</th>
                  <th>Score</th>
                  <th>Comment</th> 
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={member.student.studentId}>
                    <td>{index + 1}</td>
                    <td>{member.student.user.fullName}</td>
                    <td>{member.student.studentCode}</td>
                    <td>{member.role}</td>
                    <td>
                      <Input
                        type="number"
                        placeholder="Enter score"
                        value={scores[member.student.studentId] || ''}
                        onChange={(e) =>
                          handleScoreChange(member.student.studentId, e.target.value)
                        }
                        max={10} min={0} step={0.1}
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        placeholder="Enter comment"
                        value={comments[member.student.studentId] || ''}
                        onChange={(e) =>
                          handleCommentChange(member.student.studentId, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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

MemberScore.propTypes = {
  projectId: PropTypes.number.isRequired,
  subjectId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MemberScore;
