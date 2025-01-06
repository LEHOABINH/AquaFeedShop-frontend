import React from 'react';
import { toast } from 'react-toastify';
import { Media, Button } from './../../components';

export const showToast = (type, message, position = "top-right", autoClose = 3500) => {
    switch (type) {
        case 'success':
            toast.success(contentSuccess(message), { position, autoClose });
            break;
        case 'info':
            toast.info(contentInfo(message), { position, autoClose });
            break;
        case 'warning':
            toast.warn(contentWarning(message), { position, autoClose });
            break;
        case 'error':
            toast.error(contentError(message), { position, autoClose });
            break;
        default:
            break;
    }
};

const contentSuccess = (message) => ({ closeToast }) => (
    <Media>
        <Media middle left className="mr-3">
            <i className="fa fa-fw fa-2x fa-check"></i>
        </Media>
        <Media body>
            <Media heading tag="h6">Success!</Media>
            <p>{message}</p>
            <div className="d-flex mt-2">
                <Button color="success" onClick={closeToast}>I Understand</Button>
                <Button color="link" onClick={closeToast} className="ml-2 text-success">Close</Button>
            </div>
        </Media>
    </Media>
);

const contentInfo = (message) => ({ closeToast }) => (
    <Media>
        <Media middle left className="mr-3">
            <i className="fa fa-fw fa-2x fa-info"></i>
        </Media>
        <Media body>
            <Media heading tag="h6">Information</Media>
            <p>{message}</p>
            <div className="d-flex mt-2">
                <Button color="primary" onClick={closeToast}>I Understand</Button>
            </div>
        </Media>
    </Media>
);

const contentWarning = (message) => ({ closeToast }) => (
    <Media>
        <Media middle left className="mr-3">
            <i className="fa fa-fw fa-2x fa-exclamation"></i>
        </Media>
        <Media body>
            <Media heading tag="h6">Warning!</Media>
            <p>{message}</p>
            <div className="d-flex mt-2">
                <Button color="warning" onClick={closeToast} className="text-white">
                    I Understand
                </Button>
                <Button color="link" onClick={closeToast} className="ml-2 text-warning">
                    Cancel
                </Button>
            </div>
        </Media>
    </Media>
);

const contentError = (message) => ({ closeToast }) => (
    <Media>
        <Media middle left className="mr-3">
            <i className="fa fa-fw fa-2x fa-close"></i>
        </Media>
        <Media body>
            <Media heading tag="h6">Danger!</Media>
            <p>{message}</p>
            <div className="d-flex mt-2">
                <Button color="danger" onClick={closeToast}>I Understand</Button>
                <Button color="link" onClick={closeToast} className="ml-2 text-danger">Cancel</Button>
            </div>
        </Media>
    </Media>
);