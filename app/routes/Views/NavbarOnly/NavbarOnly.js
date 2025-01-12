import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import config from './../../../../config';
import { withPageConfig } from './../../../components/Layout/withPageConfig';
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import { TasksCardGrid } from "./components/TasksCardGrid";
import ProductKanban  from "./ProductKanban";
import {
    Container,
    Row,
    Col,
    Card,
    CardTitle,
    CardBody,
    CardFooter,
    CardColumns,
    Badge,
    UncontrolledTooltip
} from './../../../components';

class NavbarOnly extends React.Component {
    static propTypes = {
        pageConfig: PropTypes.object
    };

    // Trạng thái để lưu ảnh hiện tại
    constructor(props) {
        super(props);
        this.state = {
            imageIndex: 0,
        };
        this.images = [
            "https://res.cloudinary.com/dan0stbfi/image/upload/v1734358292/cd7a39c1ff9b42c51b8a_ycllbn.jpg",
            "https://res.cloudinary.com/dan0stbfi/image/upload/v1734358696/16d80de8a3b21eec47a3_towvnb.jpg",
            "https://res.cloudinary.com/dan0stbfi/image/upload/v1736155995/ori_jbfgdr.jpg",
            "https://res.cloudinary.com/dan0stbfi/image/upload/v1736156017/ori2_wrivub.jpg",
            "https://res.cloudinary.com/dan0stbfi/image/upload/v1721367157/30e805e4b67c14224d6d.jpg" // Ảnh mới
        ];
    }

    componentDidMount() {
        const { pageConfig } = this.props;

        pageConfig.setElementsVisibility({
            sidebarHidden: true
        });

        this.interval = setInterval(() => {
            // Thay đổi hình ảnh sau mỗi 2 giây
            this.setState((prevState) => ({
                imageIndex: (prevState.imageIndex + 1) % this.images.length
            }));
        }, 2000);
    }

    componentWillUnmount() {
        const { pageConfig } = this.props;

        pageConfig.setElementsVisibility({
            sidebarHidden: false
        });

        clearInterval(this.interval); // Dọn dẹp interval khi component unmount
    }

    handleDotClick = (index) => {
        this.setState({ imageIndex: index }); // Cập nhật hình ảnh khi click vào dot
    };

    render() {
        const { imageIndex } = this.state;
        return (
            <Container style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* Hiển thị ảnh */}
                <div style={{ position: 'relative', marginBottom: '50px' }}>
                    <img
                        src={this.images[imageIndex]} // Lấy ảnh hiện tại từ mảng images
                        alt="Navbar Banner"
                        style={{ width: '1380px', height: '250px' }}
                    />
                    {/* Dots cho ảnh */}
                    <div style={{
                        position: 'absolute',
                        bottom: '10px', // Đặt các dot ở dưới ảnh
                        left: '50%',
                        transform: 'translateX(-50%)', // Canh giữa các dot
                        textAlign: 'center',
                    }}>
                        {this.images.map((_, index) => (
                            <span
                                key={index}
                                onClick={() => this.handleDotClick(index)} // Khi click vào dot, chuyển ảnh
                                style={{
                                    display: 'inline-block',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: index === imageIndex ? '#1EB7FF' : '#ddd',
                                    margin: '0 5px',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                </div>

                <ProductKanban />


            </Container>
        );
    }
}

const ExtendedNavbarOnly = withPageConfig(NavbarOnly);

export {
    ExtendedNavbarOnly as NavbarOnly
};
