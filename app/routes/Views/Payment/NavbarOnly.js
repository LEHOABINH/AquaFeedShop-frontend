import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import config from '../../../../config';
import { withPageConfig } from '../../../components/Layout/withPageConfig';
import { ProjectsSmHeader } from "../../components/Projects/ProjectsSmHeader";
import { TasksCardGrid } from "./components/TasksCardGrid";
import Qr from './Qr';
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
} from '../../../components';


class NavbarOnly extends React.Component {
    static propTypes = {
        pageConfig: PropTypes.object
    };

    componentDidMount() {
        const { pageConfig } = this.props;
        
        pageConfig.setElementsVisibility({
            sidebarHidden: true
        });
    }

    componentWillUnmount() {
        const { pageConfig } = this.props;

        pageConfig.setElementsVisibility({
            sidebarHidden: false
        });
    }

    render() {
        return (
            <Container style={{ maxWidth: '1400px', margin: '0 auto' }}>
<Qr />
            </Container>
        );
    }
}

const ExtendedNavbarOnly = withPageConfig(NavbarOnly);

export {
    ExtendedNavbarOnly as NavbarOnly
};
