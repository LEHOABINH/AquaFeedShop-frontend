import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withPageConfig } from './../../../components/Layout/withPageConfig';
import {
    Container,
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
                <div style={{ position: 'relative' }}>
                    <img
                        src={this.images[imageIndex]} // Lấy ảnh hiện tại từ mảng images
                        alt="Navbar Banner"
                        style={{ width: '1400px', height: '250px' }}
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

                <p className="mb-5 mt-3">
                    one Welcome to the <b>&quot;Airframe&quot;</b> Admin Dashboard Theme based on <a href="https://getbootstrap.com" className="text-primary" target="_blank" rel="noopener noreferrer">Bootstrap 4.x</a> version for React called&nbsp;
                    <a href="https://reactstrap.github.io" className="text-primary" target="_blank" rel="noopener noreferrer">reactstrap</a> - easy to use React Bootstrap 4 components compatible with React 16+.
                </p>

                <section className="mb-5">
                    <h6>
                        Layouts for this framework:
                    </h6>
                    <ul className="pl-3">
                        <li>
                            <Link to="/layouts/navbar" className="text-primary">Navbar</Link>
                        </li>
                        <li>
                            <Link to="/layouts/sidebar" className="text-primary">Sidebar</Link>
                        </li>
                        <li>
                            <Link to="/layouts/sidebar-with-navbar" className="text-primary">Sidebar with Navbar</Link>
                        </li>
                    </ul>
                </section>

                <section className="mb-5">
                    <h6>
                        This Starter has:
                    </h6>
                    <ul className="pl-3">
                        <li>
                            <a href="https://webkom.gitbook.io/spin/v/airframe/airframe-react/documentation-react" className="text-primary" target="_blank" rel="noopener noreferrer">Documentation</a> - which describes how to configure this version.
                        </li>
                        <li>
                            <a href="https://webkom.gitbook.io/spin/v/airframe/airframe-react/credits-react" className="text-primary" target="_blank" rel="noopener noreferrer">Credits</a> - technical details of which versions are used for this framework.
                        </li>
                        <li>
                            <a href="https://webkom.gitbook.io/spin/v/airframe/airframe-react/roadmap-react" className="text-primary" target="_blank" rel="noopener noreferrer">Roadmap</a> - update for this technology for the coming months.
                        </li>
                        <li>
                            <b>Bugs</b> - do you see errors in this version? Please report vie email: <i>info@webkom.co</i>
                        </li>
                    </ul>
                </section>

                <section className="mb-5">
                    <h6>
                        Other versions for &quot;Airframe&quot;:
                    </h6>
                    <ul className="pl-3">
                        <li>
                            <a href="http://dashboards.webkom.co/jquery/airframe" className="text-primary">jQuery</a> - based on the newest <i>Bootstrap 4.x</i>
                        </li>
                        <li>
                            <a href="http://dashboards.webkom.co/react/airframe" className="text-primary">React</a> - based on the newest <i>Reactstrap</i>
                        </li>
                        <li>
                            <a href="http://dashboards.webkom.co/react-next/airframe" className="text-primary">Next.js (React)</a> - based on the newest <i>Reactstrap</i> and <i>Next.js</i>
                        </li>
                        <li>
                            <a href="http://dashboards.webkom.co/angular/airframe" className="text-primary">Angular</a> - based on the newest <i>ng-bootstrap</i>
                        </li>
                        <li>
                            <a href="http://dashboards.webkom.co/net-mvc/airframe" className="text-primary">.NET MVC</a> - based on the newest <i>Bootstrap 4.x</i>
                        </li>
                        <li>
                            <a href="http://dashboards.webkom.co/vue/airframe" className="text-primary">Vue.js</a> - based on the newest <i>BootstrapVue</i>
                        </li>
                        <li>
                            <b>Other Versions</b>, such as <i>Ruby on Rails, Ember, Laravel etc.</i>, please ask for the beta version via email: info@webkom.co
                        </li>
                    </ul>
                </section>

                <section className="mb-5">
                    <h6>
                        Work Orders:
                    </h6>
                    <p>
                        Regarding configuration, changes under client&apos;s requirements.<br />
                        Pleace contact us through the <a href="http://wbkom.co/contact" className="text-primary" target="_blank" rel="noopener noreferrer">webkom.co/contact</a> website.
                    </p>
                </section>

            </Container>
        );
    }
}

const ExtendedNavbarOnly = withPageConfig(NavbarOnly);

export {
    ExtendedNavbarOnly as NavbarOnly
};
