import React from 'react';
import styles from './MileStoneList.module.css';
import MileStoneItem from './MileStoneItem';

const MileStoneList = ({ milestones }) => {
  const subject1Milestones = milestones.filter(milestone => milestone.subjectId === 1);
  const subject2Milestones = milestones.filter(milestone => milestone.subjectId === 2);

  return (
    <div className={styles.container}>
      <div className={styles.subjectColumn}>
        <h2 className={styles.title}>EXE101</h2>
        {subject1Milestones.map(milestone => (
          <MileStoneItem key={milestone.id} milestone={milestone} />
        ))}
      </div>
      <div className={styles.subjectColumn}>
        <h2 className={styles.title}>EXE201</h2>
        {subject2Milestones.map(milestone => (
          <MileStoneItem key={milestone.id} milestone={milestone} />
        ))}
      </div>
    </div>
  );
};

export default MileStoneList;
