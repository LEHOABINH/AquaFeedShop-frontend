import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Input, Label, Button, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Card } from './../../../components';
import { HeaderMain } from "../../components/HeaderMain";
import FilesList from './FilesList';
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import axios from 'axios';
import FileDrop from 'react-dropzone';
import { showToast } from '../../Views/Notification';
import config from '../../../../config';
import useAuth from '../../../../hooks/useAuth';

const Files = (props) => {
    const fileInputRef = useRef(null);
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [isOver, setIsOver] = useState(false);
    const [isOverwriteDialogOpen, setIsOverwriteDialogOpen] = useState(false);
    const [duplicateFileName, setDuplicateFileName] = useState("");
    const [fileToUpload, setFileToUpload] = useState(null);

    const [searchCriteria, setSearchCriteria] = useState({
        name: '', type: '', date: ''
    });

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        handleFilter();
    }, [searchCriteria, documents]); 

    const fetchDocuments = async () => {
        try {
            const { id } = useAuth();
            const response = await axios.get(`${config.apiBaseUrl}api/document/${id}`);
            if (response.data && response.data.data) {
                setDocuments(response.data.data);
                setFilteredDocuments(response.data.data); 
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria(prev => ({ ...prev, [name]: value }));
    };

    const handleFilter = () => {
        let filtered = [...documents];

        if (searchCriteria.name) {
            filtered = filtered.filter(doc => doc.name.toLowerCase().includes(searchCriteria.name.toLowerCase()));
        }

        if (searchCriteria.type) {
            filtered = filtered.filter(doc => doc.type.toLowerCase().includes(searchCriteria.type.toLowerCase()));
        }

        if (searchCriteria.date) {
            const filterDate = new Date(searchCriteria.date);
            filtered = filtered.filter(doc => {
                const docDate = doc.modifiedDate ? new Date(doc.modifiedDate) : null;
                return docDate && docDate.toDateString() === filterDate.toDateString();
            });
        }

        setFilteredDocuments(filtered);
    };

    const handleClear = () => {
        setSearchCriteria({ name: '', type: '', date: '' });
        setFilteredDocuments(documents); 
    };

    const handleAddNewClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const formData = new FormData();
            formData.append('file', files[0]);

            try {
                const { id } = useAuth();
                await axios.post(`${config.apiBaseUrl}api/document/upload?userId=${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                showToast('success', 'File added successfully');
                fetchDocuments();
            } catch (error) {
                console.error('Error uploading file:', error.response ? error.response.data : error.message);
            
                if (error.response && error.response.data?.errorMessage) {
                    const errorMessage = error.response.data.errorMessage;
            
                    if (errorMessage === "Document with the same name already exists.") {
                        setDuplicateFileName(files[0].name);
                        setFileToUpload(files[0]);
                        setIsOverwriteDialogOpen(true);
                    } else if (errorMessage === "Project not found for the given student.") {
                        showToast('error', 'Currently, you do not have any projects.');
                    } else {
                        showToast('error', 'An unexpected error occurred');
                    }
                } else {
                    showToast('error', 'Failed to connect to the server');
                }
            }
            
        }
    };

    const handleDrop = (acceptedFiles) => {
        const event = {
            target: {
                files: acceptedFiles
            }
        };

        handleFileChange(event);
    };

    return (
        <React.Fragment>
            <Container fluid>
                <HeaderMain title="Documents" />

                <div className="mb-2">
                    <FileDrop
                        multiple
                        onDragEnter={() => setIsOver(true)}
                        onDragLeave={() => setIsOver(false)}
                        onDrop={handleDrop}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()} className={`dropzone ${isOver ? 'dropzone--active' : ''}`}>
                                <i className="fa fa-cloud-upload fa-fw fa-3x mb-3"></i>
                                <h5 className='mt-0'>Upload Your files</h5>
                                <p>Drag a file here or <span className='text-primary'>browse</span> for a file to upload.</p>
                                <p className="small">JPG, GIF, PNG, MOV, and AVI. Please choose files under 2GB for upload.</p>
                                <input {...getInputProps()} />
                            </div>
                        )}
                    </FileDrop>
                </div>

                <Card className="mb-3 p-3">
                    <Row>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="searchName">File Name</Label>
                                <Input type="text" id="searchName" name="name" placeholder="Enter file name" value={searchCriteria.name} onChange={handleSearchChange} />
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="searchType">File Type</Label>
                                <Input type="select" id="searchType" name="type" value={searchCriteria.type} onChange={handleSearchChange}>
                                    <option value="">Select file type</option>
                                    <option value="TXT">TXT</option>
                                    <option value="PDF">PDF</option>
                                    <option value="DOC">DOC</option>
                                    <option value="DOCX">DOCX</option>
                                    <option value="XLS">XLS</option>
                                    <option value="XLSX">XLSX</option>
                                    <option value="PPT">PPT</option>
                                    <option value="PPTX">PPTX</option>
                                    <option value="JPG">JPG</option>
                                    <option value="PNG">PNG</option>
                                    <option value="ZIP">ZIP</option>
                                    <option value="RAR">RAR</option>
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="searchDate">Upload Date</Label>
                                <Input type="date" id="searchDate" name="date" value={searchCriteria.date} onChange={handleSearchChange} />
                            </FormGroup>
                        </Col>
                        <Col md={3} className="d-flex align-items-center" style={{ marginTop: '12px' }}>
                            <Button className="btn btn-secondary" onClick={handleClear} style={{ marginLeft: '10px' }}>
                                Clear
                            </Button>
                        </Col>
                    </Row>
                </Card>

                <ProjectsSmHeader
                    subTitle="Document"
                    onAddNewClick={handleAddNewClick}
                />

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                <FilesList documents={filteredDocuments} onDocumentsChange={fetchDocuments} />
            </Container>

            <Modal isOpen={isOverwriteDialogOpen} toggle={() => setIsOverwriteDialogOpen(false)}>
                <ModalHeader toggle={() => setIsOverwriteDialogOpen(false)}>Confirm Overwrite</ModalHeader>
                <ModalBody>
                    The file "{duplicateFileName}" already exists. Do you want to overwrite it?
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setIsOverwriteDialogOpen(false)}>Cancel</Button>
                    <Button
                        color="primary"
                        onClick={async () => {
                            try {
                                const { id } = useAuth();
                                const formData = new FormData();
                                formData.append('file', fileToUpload);
                                await axios.post(`${config.apiBaseUrl}api/document/overwrite?userId=${id}`, formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                });
                                showToast('success', 'File overwritten successfully');
                                fetchDocuments();
                                setIsOverwriteDialogOpen(false);
                            } catch (error) {
                                console.error('Error uploading file:', error.response ? error.response.data : error.message);
                            }
                        }}
                    >
                        Overwrite
                    </Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
};

Files.propTypes = {
    match: PropTypes.object.isRequired
};

export default Files;
