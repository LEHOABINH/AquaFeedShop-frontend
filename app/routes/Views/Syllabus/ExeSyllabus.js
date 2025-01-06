import React, { useState } from "react";
import styles from "./ExeSyllabus.module.css";

function ExeSyllabus() {
  const [activeTab, setActiveTab] = useState("EXE101");

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Experiential Entrepreneurship</h1>
        <p>Chương trình đào tạo khởi nghiệp chuyên sâu</p>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "EXE101" ? styles.active1 : ""}`}
          onClick={() => setActiveTab("EXE101")}
        >
          EXE101
        </button>
        <button
          className={`${styles.tab} ${activeTab === "EXE201" ? styles.active2 : ""}`}
          onClick={() => setActiveTab("EXE201")}
        >
          EXE201
        </button>
      </div>

      {/* Content */}
      {activeTab === "EXE101" && (
        <div className={styles.content}>
          <div className={styles.card1}>
            <h2>🎓 Course Content</h2>
            <ul>
              <li>Students are divided into teams of 4 to 6 people. Each team must be formed with at least 2 different majors.</li>
              <li>Each team will develop a startup idea and work on the project with guidance and support from instructors and mentors throughout the course.</li>
              <li>There will be workshops or seminars with guest speakers, entrepreneurs, or venture capitalists, who will share their extensive experience and unique perspectives in the world of startup companies.</li>
              <li>Provide effective startup knowledge and strategies.</li>
              <li>Develop modern business thinking.</li>
            </ul>
          </div>
          <div className={styles.card1}>
            <h2>💡 Learning Methods</h2>
            <ul>
              <li>Learn through videos from startup founders.</li>
              <li>Weekly live sessions with experts.</li>
              <li>Work in teams with members from different fields.</li>
              <li>Develop real-life startup projects.</li>
            </ul>
          </div>
          <div className={styles.card3}>
            <h2>⏰ Student Requirements</h2>
            <ul>
              <li>Attend ≥ 80% of the classes.</li>
              <li>Submit assignments on time.</li>
              <li>Follow the academic regulations.</li>
            </ul>
            <p>
              <a href="https://flm.fpt.edu.vn/">📄 FLM Study Materials</a>
              <br />
              <a href="https://fu-edunext.fpt.edu.vn/">🌐 Edunext System</a>
            </p>
          </div>
        </div>
      )}

      {activeTab === "EXE201" && (
        <div className={styles.content}>
          <div className={styles.card2}>
            <h2>🎓 Course Content</h2>
            <ul>
              <li>Students are divided into teams of 6 to 8 people. Each team must be formed with at least 2 different majors.</li>
              <li>Develop a product/service from the EXE101 idea.</li>
              <li>Real-world sales practice and customer outreach.</li>
              <li>Learn from in-depth lectures.</li>
              <li>Participate in professional workshops and seminars.</li>
            </ul>
          </div>
          <div className={styles.card2}>
            <h2>💡 Learning Methods</h2>
            <ul>
              <li>Learn through videos from startup founders.</li>
              <li>Weekly live sessions with experts.</li>
              <li>Work in teams with members from different fields.</li>
              <li>Develop real-life startup projects.</li>
            </ul>
          </div>
          <div className={styles.card3}>
            <h2>⏰ Student Requirements</h2>
            <ul>
              <li>Attend ≥ 80% of the classes.</li>
              <li>Submit assignments on time.</li>
              <li>Follow the academic regulations.</li>
            </ul>
            <p>
              <a href="https://flm.fpt.edu.vn/">📄 FLM Study Materials</a>
              <br />
              <a href="https://fu-edunext.fpt.edu.vn/">🌐 Edunext System</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExeSyllabus;
