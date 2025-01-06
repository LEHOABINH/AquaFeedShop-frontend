import React, { useState, useEffect} from "react";
import { 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button,
    Input,
    Label,
    Form,
    FormGroup,
    Col,
} from "../../../../components";
import { ButtonInput } from "../../../Forms/DatePicker/components";
import DatePicker, { setDefaultLocale } from 'react-datepicker';
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { showToast } from "../../Utils/Toast";
import axios from "axios";
import config from "../../../../../config";
import useAuth from "../../../../../hooks/useAuth";
import moment from 'moment';

const ModalCreateEvent = ({ isOpen, toggle, errors }) => {

    const handleExportFile = async () => {
        const blob = new Blob([errors.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "errors.txt";
        a.click();
        URL.revokeObjectURL(url);
    };
    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalHeader tag="h6">
                <i className="fa fa-bug mr-2"></i> Import Failed
            </ModalHeader>
            <ModalBody style={{ maxHeight: '60vh', overflowY: 'auto', }}>
                <ul style={{
                    listStyleType: "none",
                    paddingLeft: "0",
                    marginBottom: "0",
                }}>
                    {errors.map((error, index) => (
                        <li key={index}
                            style={{
                                padding: "5px 0",
                                fontSize: "14px",
                                color: "#d9534f",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <i className="fa fa-exclamation-circle" style={{ marginRight: '8px', color: '#dc3545' }}></i>
                            {error}
                        </li>
                    ))}
                </ul>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleExportFile}>Export File</Button>
                <Button color="secondary" onClick={toggle}>Close</Button>
            </ModalFooter>
        </Modal>
    );
};

export default ModalCreateEvent;
