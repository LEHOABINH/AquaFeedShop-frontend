import React, { useState } from "react";

const TrTableStudentsWithoutGroupList = ({ student }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(student.studentCode).then(() => {
      setIsCopied(true); // Đặt trạng thái đã sao chép
      setTimeout(() => setIsCopied(false), 2000); // Reset trạng thái sau 2 giây
    }).catch(() => {
      console.error("Failed to copy student code.");
    });
  };

  return (
    <>
      <tr>
        <td className="align-middle">{student.fullName}</td>
        <td className="align-middle">{student.email}</td>
        <td className="align-middle">{student.phone}</td>
        <td
          className="align-middle copy-text"
          onClick={handleCopy}
          style={{
            cursor: "pointer",
            color: isCopied ? "primary" : "#007bff", 
            opacity: isCopied ? 0.5 : 1, 
            userSelect: "none",
            whiteSpace: "nowrap",
            transition: "color 0.2s, opacity 0.2s", 
          }}
          title={isCopied ? "Copied!" : "Click to copy"}
        >
          {student.studentCode}
        </td>
        <td className="align-middle">{student.campusCode || "N/A"}</td>
        <td className="align-middle">{student.subjectCode || "N/A"}</td>
        <td className="align-middle">{student.major}</td>
        <td className="align-middle">{student.lecturer}</td>
      </tr>
    </>
  );
};

export default TrTableStudentsWithoutGroupList;
