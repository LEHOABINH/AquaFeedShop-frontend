import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Row,
    Col,
} from './../../../components';
import { HeaderMain } from "../../components/HeaderMain";
import WorkshopsList from './WorkshopsList';
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import WorkshopFormModal from './components/WorkshopFromModal';
import useAuth from '../../../../hooks/useAuth';
import config from '../../../../config';

const Workshops = () => {
    const [workshops, setWorkshops] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [workshopData, setWorkshopData] = useState(null);
    const { role, hasPermission } = useAuth();

    const fetchWorkshops = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/workshop`, {
                withCredentials: true,
              });
            setWorkshops(response.data.data);
        } catch (error) {
            console.error('Error fetching workshop data:', error);
        }
    };

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
        setWorkshopData(null);
    };

    const handleWorkshopSaved = async () => {
        await fetchWorkshops();
        setModalOpen(false);
    };

    return (
        <React.Fragment>
            <Container fluid>
                <HeaderMain
                    title="Workshops"
                    className="mb-5 mt-4"
                />
                <Row>
                    <Col lg={12}>
                        {hasPermission("create_workshop") && (
                            <ProjectsSmHeader
                                onAddNewClick={toggleModal}
                            />
                        )}
                        <WorkshopsList workshops={workshops} onWorkshopSaved={handleWorkshopSaved} />
                    </Col>
                </Row>
                <WorkshopFormModal isOpen={modalOpen} toggle={toggleModal} workshopData={workshopData} onWorkshopSaved={handleWorkshopSaved} />
            </Container>
        </React.Fragment>
    );
};

export default Workshops;
