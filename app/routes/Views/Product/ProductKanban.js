import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../../config';
import { showToast } from "../Utils/Toast";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { NavbarCart } from './components/NavbarCart';
import {
    Container,
    Row,
    Col,
    Card,
    CardTitle,
    CardBody,
    CardFooter,
    Badge,
    UncontrolledTooltip,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '../../../components';


import { TasksCardGrid } from "./components/TasksCardGrid";


const ProductKanban = () => {
    const [data, setData] = useState([]); // State lưu trữ dữ liệu từ API

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}api/product`, {
                withCredentials: true,
            });

            if (response.data.success) {
                setData(response.data.data); // Cập nhật dữ liệu
            } else {
                showToast('warning', 'You do not have any.');
                console.error('Failed to fetch');
            }
        } catch (error) {
            console.error('Error fetching :', error);
        }
    };

    useEffect(() => {
        fetchProduct(); 
    }, []);

    return (
        <React.Fragment>
            <Container style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <Row>
                    <Col lg={12}>
                        <Row>
                            {data.map((product, index) => (
                                <Col lg={3} md={6} sm={12} key={index} style={{ marginBottom: '20px' }}>
                                   
                                    <TasksCardGrid
                                        productName={product.productName}
                                        price={product.price}
                                        description={product.description}
                                        productId={product.productId}
                                        image={product.image}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default ProductKanban;
