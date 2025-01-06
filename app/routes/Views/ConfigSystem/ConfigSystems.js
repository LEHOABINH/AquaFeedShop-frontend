import React, { useState, useEffect } from "react";
import {
    Card,
    CardFooter,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
} from "./../../../components";
import { HeaderMain } from "../../components/HeaderMain";
import { TrTableConfigSystemsList } from "./components/TrTableConfigSystemsList";
import { Paginations } from "../../components/Paginations";
import config from "../../../../config";
import { showToast } from "../Notification";
import axios from "axios";

const ConfigSystems = () => {
    const [configs, setConfigs] = useState([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [configIdToDelete, setConfigIdToDelete] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [configData, setConfigData] = useState(null);

    const [editNumber, setEditNumber] = useState(null);
    const [editStartDate, setEditStartDate] = useState("");

    const fetchConfigs = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/configsystem`, {
                withCredentials: true,
            });
            if (response.data.success) {
                setConfigs(response.data.data);
            } else {
                showToast("error", "Failed to fetch configuration systems.");
            }
        } catch (error) {
            console.error("Error fetching config systems:", error);
            showToast("error", "An error occurred while fetching data.");
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    const handleDeleteClick = (configId) => {
        setConfigIdToDelete(configId);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(
                `${config.apiBaseUrl}api/configsystem/${configIdToDelete}`,
                { withCredentials: true }
            );
            showToast("success", "Configuration deleted successfully");
            setDialogOpen(false);
            fetchConfigs();
        } catch (error) {
            console.error("Error deleting configuration:", error);
            showToast("error", "Failed to delete configuration.");
        }
    };

    const toggleDialog = () => setDialogOpen(!isDialogOpen);
    const toggleModal = () => {
        setModalOpen(!isModalOpen);
        setConfigData(null);
        setEditNumber(null);
        setEditStartDate("");
    };

    const handleEditConfig = (config) => {
        setConfigData(config);
        setEditNumber(config.number !== null ? config.number : "");
        setEditStartDate(config.startDate ? config.startDate.split("T")[0] : "");
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const updatedConfig = {
                configSystemId: configData.configId,
                number: editNumber !== "" ? parseInt(editNumber, 10) : null,
                startDate: editStartDate !== "" ? new Date(editStartDate).toISOString() : null,
            };
            console.log(updatedConfig)
    
            await axios.put(`${config.apiBaseUrl}api/configsystem`, updatedConfig, {
                withCredentials: true,
            });
    
            showToast("success", "Configuration updated successfully");
            fetchConfigs(); 
            toggleModal(); 
        } catch (error) {
            console.error("Error saving configuration:", error);
            showToast("error", "Failed to update configuration.");
        }
    };

    return (
        <Container fluid>
            <HeaderMain title="System Configuration" className="mb-1 mt-4" />
            <Row>
                <Col lg={12}>
                    <Card className="mb-3">
                        <div className="table-responsive-xl">
                            <Table className="mb-0" hover>
                                <thead>
                                    <tr>
                                        <th className="align-middle bt-0">Config ID</th>
                                        <th className="align-middle bt-0">Config Name</th>
                                        <th className="align-middle bt-0">Number</th>
                                        <th className="align-middle bt-0">Start Date</th>
                                        <th className="align-middle bt-0 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {configs.map((config) => (
                                        <TrTableConfigSystemsList
                                            key={config.configId}
                                            config={config}
                                            onEdit={() => handleEditConfig(config)}
                                        />
                                    ))}
                                </tbody>
                            </Table>
                        </div>

                        <Modal isOpen={isDialogOpen} toggle={toggleDialog}>
                            <ModalHeader toggle={toggleDialog}>Confirm Deletion</ModalHeader>
                            <ModalBody>Are you sure you want to delete this configuration?</ModalBody>
                            <ModalFooter>
                                <Button color="secondary" onClick={toggleDialog}>
                                    Cancel
                                </Button>
                                <Button color="danger" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </Modal>

                        {isModalOpen && (
                            <Modal isOpen={isModalOpen} toggle={toggleModal}>
                                <ModalHeader toggle={toggleModal}>Edit Configuration</ModalHeader>
                                <ModalBody>
                                    <Form>
                                        <FormGroup>
                                            <Label for="editConfigId">Config ID</Label>
                                            <Input
                                                id="editConfigId"
                                                type="text"
                                                value={configData?.configId || ""}
                                                readOnly
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="editConfigName">Config Name</Label>
                                            <Input
                                                id="editConfigName"
                                                type="text"
                                                value={configData?.configName || ""}
                                                readOnly
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="editNumber">Number</Label>
                                            <Input
                                                id="editNumber"
                                                type="number"
                                                value={editNumber}
                                                onChange={(e) => setEditNumber(e.target.value)}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="editStartDate">Start Date</Label>
                                            <Input
                                                id="editStartDate"
                                                type="date"
                                                value={editStartDate}
                                                onChange={(e) => setEditStartDate(e.target.value)}
                                            />
                                        </FormGroup>
                                    </Form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={toggleModal}>
                                        Cancel
                                    </Button>
                                    <Button color="primary" onClick={handleSave}>
                                        Save
                                    </Button>
                                </ModalFooter>
                            </Modal>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ConfigSystems;
