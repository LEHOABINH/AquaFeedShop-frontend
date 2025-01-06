import React, { useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardFooter,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from './../../../components';
import { Paginations } from "../../components/Paginations";
import TrTableFilesList from './components/TrTableFilesList';
import { showToast } from '../../Views/Notification';

const FilesList = ({ documents, onDocumentsChange }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [documentsPerPage, setDocumentsPerPage] = useState(10);

    const indexOfLastDocument = currentPage * documentsPerPage;
    const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
    const currentDocuments = documents.slice(indexOfFirstDocument, indexOfLastDocument);
    const totalPages = Math.ceil(documents.length / documentsPerPage);

    const handleDelete = async () => {
        try {
            await axios.delete(`${config.apiBaseUrl}api/document/documentid?documentId=${selectedDocumentId}`);
            showToast('success', 'Document deleted successfully');
            onDocumentsChange();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    };

    const handleDeleteClick = (documentId) => {
        setSelectedDocumentId(documentId);
        setIsDialogOpen(true);
    };

    const toggleDialog = () => {
        setIsDialogOpen(!isDialogOpen);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDocumentsPerPageChange = (event) => {
        setDocumentsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    return (
        <Card className="mb-3">
            <div className="table-responsive-xl">
                <Table className="mb-0" hover>
                    <thead>
                        <tr>
                            <th className="align-middle bt-0">Name</th>
                            <th className="align-middle bt-0">Type</th>
                            <th className="align-middle bt-0">Upload By</th>
                            <th className="align-middle bt-0">Modified By</th> 
                            <th className="align-middle bt-0">Modified Date</th>
                            <th className="align-middle bt-0 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDocuments.map((document) => (
                            <TrTableFilesList
                                key={document.documentId}
                                document={document}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </tbody>
                </Table>
            </div>
            <CardFooter className="d-flex justify-content-center pb-0">
                <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onRecordsPerPageChange={handleDocumentsPerPageChange}
                    recordsPerPage={documentsPerPage}
                />
            </CardFooter>

            <Modal isOpen={isDialogOpen} toggle={toggleDialog}>
                <ModalHeader toggle={toggleDialog}>Confirm Deletion</ModalHeader>
                <ModalBody>Are you sure you want to delete this document?</ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleDialog}>Cancel</Button>
                    <Button color="danger" onClick={handleDelete}>Delete</Button>
                </ModalFooter>
            </Modal>
        </Card>
    );
};

export default FilesList;
