import React, { useState } from 'react';
import {
    Card,
    CardFooter,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Row,
    Col
} from './../../../components';
import { TrTableWorkshopsList } from "./components/TrTableWorkshopsList";
import { Paginations } from "../../components/Paginations";
import WorkshopFormModal from './components/WorkshopFromModal'
import { showToast } from '../Notification';
import useAuth from "../../../../hooks/useAuth";
import axios from 'axios';
import config from '../../../../config';

const WorkshopsList = ({ workshops, onWorkshopSaved }) => {
    const { role } = useAuth();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [workshopIdToDelete, setWorkshopIdToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [workshopsPerPage, setWorkshopsPerPage] = useState(10);
    const [isModalOpen, setModalOpen] = useState(false);
    const [workshopData, setWorkshopData] = useState(null);

    const handleDeleteClick = (workshopId) => {
        setWorkshopIdToDelete(workshopId);
        setDialogOpen(true);
    };

    const handleDelete = async (workshopId) => {
        const respone = await axios.delete(`${config.apiBaseUrl}api/workshop/${workshopId}`, {
            withCredentials: true
        });
        if (respone.status === 204) {
            onWorkshopSaved();
            showToast('success', 'Workshop deleted successfully');
        }
        setDialogOpen(false);
    };

    const toggleDialog = () => setDialogOpen(!isDialogOpen);
    const toggleModal = () => {
        setModalOpen(!isModalOpen);
        setWorkshopData(null);
    };

    const handleEditWorkshop = (workshop) => {
        setWorkshopData(workshop);
        setModalOpen(true);
    };

    const indexOfLastWorkshop = currentPage * workshopsPerPage;
    const indexOfFirstWorkshop = indexOfLastWorkshop - workshopsPerPage;
    const currentWorkshops = workshops.slice(indexOfFirstWorkshop, indexOfLastWorkshop);
    const totalPages = Math.ceil(workshops.length / workshopsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleWorkshopsPerPageChange = (event) => {
        setWorkshopsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    return (
        <>
            <Row className="">
                {currentWorkshops.map((workshop, index) => (
                    <Col key={workshop.workshopId} md={6}>
                        <TrTableWorkshopsList
                            workshop={workshop}
                            onDelete={() => handleDeleteClick(workshop.workshopId)}
                            onEdit={() => handleEditWorkshop(workshop)}
                        />
                    </Col>
                ))}
            </Row>

            <Paginations
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onRecordsPerPageChange={handleWorkshopsPerPageChange}
                recordsPerPage={workshopsPerPage}
            />

            <Modal isOpen={isDialogOpen} toggle={toggleDialog}>
                <ModalHeader toggle={toggleDialog}>Confirm Deletion</ModalHeader>
                <ModalBody>Are you sure you want to delete this workshop?</ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleDialog}>Cancel</Button>
                    <Button color="danger" onClick={() => handleDelete(workshopIdToDelete)}>Delete</Button>
                </ModalFooter>
            </Modal>

            <WorkshopFormModal
                isOpen={isModalOpen}
                toggle={toggleModal}
                workshopData={workshopData}
                onWorkshopSaved={onWorkshopSaved}
            />
        </>
    );
};

export default WorkshopsList;
