import React from "react";
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Media
} from "./../../../../components";
import config from "../../../../../config";
import axios from "axios";

const badges = ["secondary"];
const status = ["success", "danger", "warning", "secondary"];

const getFileIcon = (fileType) => {
  switch (fileType) {
    case "TXT":
      return "fa fa-file-text-o";
    case "PDF":
      return "fa fa-file-pdf-o";
    case "DOC":
    case "DOCX":
      return "fa fa-file-word-o";
    case "XLS":
    case "XLSX":
      return "fa fa-file-excel-o";
    case "ppt":
    case "pptx":
      return "fa fa-file-powerpoint-o";
    case "JPG":
    case "PNG":
      return "fa fa-file-image-o";
    case "zip":
    case "rar":
      return "fa fa-file-archive-o";
    default:
      return "fa fa-file-o";
  }
};

const getTypeBadgeColor = (fileType) => {
  switch (fileType) {
    case "TXT":
      return "#808080"; 
    case "PDF":
      return "#FF0000"; 
    case "DOC":
    case "DOCX":
      return "#2B579A"; 
    case "XLS":
    case "XLSX":
      return "#217346"; 
    case "PPT":
    case "PPTX":
      return "#D24726"; 
    case "JPG":
    case "PNG":
      return "#00A1F1"; 
    case "ZIP":
    case "RAR":
      return "#4E4E4E"; 
    default:
      return "#6c757d"; 
  }
};

const downloadDocument = async (documentId) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}api/document/download?documentId=${documentId}`);
    
    console.log(response.data);
    
    const { url } = response.data;

    const link = document.createElement('a');
    link.href = url;
    link.download = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?')); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading document:", error);
  }
};



const formatFileSize = (sizeInBytes) => {
  if (sizeInBytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
  return parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const TrTableFilesList = ({ document, onDelete }) => {

  const formattedSize = formatFileSize(document.size);
  const badgeColor = getTypeBadgeColor(document.type);

  return (
    <tr>
      <td className="align-middle">
        <Media>
          <Media left middle>
            <i className={`${getFileIcon(document.type)} fa-3x mr-2`} style={{ color: "#6c757d" }}></i>
          </Media>
          <Media body>
            <div className="text-inverse">{document.name}</div>
            <span>{formattedSize}</span>
          </Media>
        </Media>
      </td>
      <td className="align-middle">
        <span
          style={{
            backgroundColor: badgeColor,
            color: "#fff",
            padding: "0px 5px",
            borderRadius: "5px",
          }}
        >
          {document.type}
        </span>
      </td>
      <td className="align-middle">
        <div className="text-inverse"><strong>{document.uploadBy}</strong></div>
      </td>
      <td className="align-middle">
        <div className="text-inverse"><strong>{document.modifiedBy || "N/A"}</strong></div> 
      </td>
      <td className="align-middle">
        <div className="text-inverse">
          {document.modifiedDate ? new Date(document.modifiedDate).toLocaleString() : "N/A"} {/* Format ngày nếu có */}
        </div>
      </td>
      <td className="align-middle text-right">
        <UncontrolledButtonDropdown>
          <DropdownToggle color="link">
            <i className="fa fa-gear" />
            <i className="fa fa-angle-down ml-2" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onClick={() => downloadDocument(document.documentId)}>
              <i className="fa fa-fw fa-download mr-2"></i>
              Download
            </DropdownItem>
            <DropdownItem onClick={() => onDelete(document.documentId)}>
              <i className="fa fa-fw fa-trash mr-2"></i>
              Delete
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </td>
    </tr>
  );
};

export default TrTableFilesList;
