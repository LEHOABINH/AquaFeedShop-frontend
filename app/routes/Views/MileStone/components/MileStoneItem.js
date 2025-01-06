import React, { useState } from 'react';
import styles from './MileStoneItem.module.css';

const MileStoneItem = ({ milestone }) => {

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); // Lấy ngày (2 chữ số)
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Lấy tháng (2 chữ số, bắt đầu từ 0)
    const year = d.getFullYear(); // Lấy năm
    return `${day}-${month}-${year}`; // Kết hợp thành DD-MM-YYYY
  };

  return (
    <div className={styles.milestoneItem}>
      <h3 className={styles.title}>
        #{milestone.milestoneName}
      </h3>
      <p className={styles.description}>{milestone.description}</p>

      {/* Hiển thị ngày bắt đầu và kết thúc */}
      <div className={styles.dateContainer}>
        <p className={styles.date}>
          <strong>Start Date:</strong> {formatDate(milestone.startDate)}
        </p>
        <p className={styles.date}>
          <strong>End Date:</strong> {formatDate(milestone.endDate)}
        </p>
      </div>

      {/* Hiển thị tiêu chí */}
      {milestone.criteria && milestone.criteria.length > 0 && (
        <div className={styles.criteria}>
          <h4 className={styles.criteriaH4}>Criteria:</h4>
          <ul className={styles.criteriaList}>
            {milestone.criteria.map((criterion) => (
              <li key={criterion.criteriaId} className={styles.criteriaItem}>
                <span className={styles.criteriaTitle}>{criterion.criteriaName}</span>
                <p>{criterion.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MileStoneItem;