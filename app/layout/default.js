import React from 'react';
import PropTypes from 'prop-types';

import {
    Layout,
    ThemeSelector,
    ThemeProvider,
    PageConfigConsumer,
} from './../components';

import './../styles/bootstrap.scss';
import './../styles/main.scss';
import './../styles/plugins/plugins.scss';
import './../styles/plugins/plugins.css';

import {
    RoutedNavbars,
    RoutedSidebars,
} from './../routes';

const favIcons = [
    { rel: 'icon', type: 'image/x-icon', href: 'https://res.cloudinary.com/dan0stbfi/image/upload/v1737389312/Logo_iowj5c.png' },

    { rel: 'apple-touch-icon', sizes: '180x180', href: 'https://res.cloudinary.com/dan0stbfi/image/upload/v1737389312/Logo_iowj5c.png' },

    { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'https://res.cloudinary.com/dan0stbfi/image/upload/v1737389312/Logo_iowj5c.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: 'https://res.cloudinary.com/dan0stbfi/image/upload/v1737389312/Logo_iowj5c.png' }
];

class AppLayout extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired
    }

    render() {
        const { children } = this.props;
        
        return (
            <ThemeProvider initialStyle="light" initialColor="primary">
                <Layout sidebarSlim favIcons={ favIcons }>
                    { /* --------- Navbar ----------- */ }
                    <Layout.Navbar>
                        <RoutedNavbars />
                    </Layout.Navbar>
                    { /* -------- Sidebar ------------*/ }
                    <Layout.Sidebar>
                        <RoutedSidebars />
                    </Layout.Sidebar>

                    { /* -------- Content ------------*/ }
                    <Layout.Content>
                        { children }
                    </Layout.Content>

                    { /* -- Theme Selector (DEMO) ----*/ }
                    {/* <PageConfigConsumer>
                    {
                        ({ sidebarHidden, navbarHidden }) => (
                            <ThemeSelector styleDisabled={ sidebarHidden && navbarHidden } />
                        )
                    }
                    </PageConfigConsumer> */}
                </Layout>
            </ThemeProvider>
        );
    }
}

export default AppLayout;
