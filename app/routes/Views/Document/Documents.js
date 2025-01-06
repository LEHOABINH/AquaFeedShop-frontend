import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Input, Label, Button, FormGroup, Card } from './../../../components';
import { HeaderMain } from "../../components/HeaderMain";
import DocumentsList from './DocumentsList';
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import axios from 'axios';
import config from '../../../../config';
import useAuth from '../../../../hooks/useAuth';
import { useParams } from "react-router-dom";

const Documents = (props) => {
    const { projectId } = useParams();
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [checkingProject, setCheckingProject] = useState(false);

    const [searchCriteria, setSearchCriteria] = useState({
        name: '', type: '', date: ''
    });

    const checkingProjectOfUser = async () => {
        try {
            const checkingResponse = await axios.get(
            `${config.apiBaseUrl}api/projects/checkingproject?projectId=${projectId}`,
            { withCredentials: true }
            );      
            if (checkingResponse.data.success) {
            setCheckingProject(checkingResponse.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
    if (projectId) {      
        checkingProjectOfUser();
    }
    }, [projectId]);

    useEffect(() => {
    if (checkingProject === true) {      
        fetchDocuments();  
    }
    }, [projectId, checkingProject]);

    useEffect(() => {
        handleFilter();
    }, [searchCriteria, documents]); 

    const fetchDocuments = async () => {
        try {
            const { id } = useAuth();
            const response = await axios.get(`${config.apiBaseUrl}api/document/getByProjectId/${projectId}`);
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

    if (checkingProject === false) {
    return <div>You do not have permission to access this content</div>;
    }

    return (
        <React.Fragment>
            <Container fluid>
                <HeaderMain title="Documents" />
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
                />
                <DocumentsList documents={filteredDocuments} onDocumentsChange={fetchDocuments} />
            </Container>

        </React.Fragment>
    );
};

Documents.propTypes = {
    match: PropTypes.object.isRequired
};

export default Documents;
