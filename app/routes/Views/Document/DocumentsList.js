import React, { useState } from 'react';
import {
    Card,
    CardFooter,
    Table,
} from './../../../components';
import { Paginations } from "../../components/Paginations";
import TrTableFilesList from './components/TrTableFilesList';

const DocumentsList = ({ documents, onDocumentsChange }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [documentsPerPage, setDocumentsPerPage] = useState(10);

    const indexOfLastDocument = currentPage * documentsPerPage;
    const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
    const currentDocuments = documents.slice(indexOfFirstDocument, indexOfLastDocument);
    const totalPages = Math.ceil(documents.length / documentsPerPage);


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
        </Card>
    );
};

export default DocumentsList;
