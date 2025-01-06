import React, { useState, useEffect, useRef } from 'react';
import { Upload, CloudUpload } from 'lucide-react';
import axios from 'axios';
import config from './../../../../config';
import MileStoneList from './components/MileStoneList';
import useAuth from "../../../../hooks/useAuth";
import { showToast } from "./../Utils/Toast";
import styles from './MileStones.module.css';

const MileStones = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { role } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showUploadSection, setShowUploadSection] = useState(false);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}api/MileStone/getallmilestoneswithcriteria`,
            { withCredentials: true }
        );
        setMilestones(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMilestones();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast("warning", "Please select an Excel file to upload!");

      return;
    }

    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}api/MileStone/upload-excel`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        showToast("success", "File uploaded successfully!");
      } else {
        console.error('Failed to fetch Group Member Role');
      }
    } catch (error) {
      showToast("error", error.response?.data?.errorMessage || "Failed to upload file!");
      console.error("Error uploading file:", error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (loading) return <div className="p-4 text-center">Loading milestones...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Milestones and Criteria</h1>

      {/* Button để hiện phần Upload */}
      {role === "Manager" && (
        <button 
          onClick={() => setShowUploadSection(!showUploadSection)} // Toggle trạng thái
          className="btn btn-primary mb-3"
        >
          Change Milestone With Criteria
        </button>
      )}
      {/* Update by Excel Button */}
      {showUploadSection  && role === "Manager" && (
        <div className={styles.uploadContainer}>
          <div 
            className={`${styles.uploadDropzone} ${selectedFile ? styles.fileSelected : ''}`}
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            <CloudUpload size={48} className={styles.uploadIcon} />
            <p className={styles.uploadText}>
              {selectedFile 
                ? `Selected: ${selectedFile.name}` 
                : "Drag and drop Excel file or Click to Upload"}
            </p>
          </div>
          
          <button 
            onClick={handleUpload} 
            className={styles.uploadButton}
            disabled={!selectedFile}
          >
            <Upload size={20} />
            <span>Upload Milestone With Criteria</span>
          </button>
        </div>
      )}
      <MileStoneList milestones={milestones} />
    </div>
  );
};

export default MileStones;