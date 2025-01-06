import React from 'react';
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router } from 'react-router-dom';

import AppLayout from './../../layout/default';
import { RoutedContent } from './../../routes';
import { ToastContainer } from 'react-toastify';

const basePath = process.env.BASE_PATH || '/';

const AppClient = () => {
    return (
        <Router basename={ basePath }>
            <AppLayout>
                <RoutedContent />
            </AppLayout>
            <ToastContainer
                draggable={false}
                hideProgressBar={true}
            />
        </Router>
    );
}

export default hot(module)(AppClient);